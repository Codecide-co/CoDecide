from flask import Blueprint, jsonify, request

from app.extensions import db
from app.middleware.auth import admin_required
from app.models.user import User
from mongo.audit_log import AuditLog

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_bp.route("/users", methods=["GET"])
@admin_required
def list_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200


@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id: int):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    AuditLog.create(
        user_id=request.current_user.id,
        action="delete",
        entity_type="user",
        entity_id=user_id,
        details={"deleted_user_email": user.email},
    )

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200


@admin_bp.route("/audit-logs", methods=["GET"])
@admin_required
def get_audit_logs():
    limit = request.args.get("limit", 100, type=int)
    logs = AuditLog.find_all(limit=limit)
    return jsonify([AuditLog.to_dict(log) for log in logs]), 200


@admin_bp.route("/reports/<int:report_id>/assign", methods=["PATCH"])
@admin_required
def assign_report(report_id: int):
    from app.models.report import Report

    report = db.session.get(Report, report_id)
    if not report:
        return jsonify({"error": "Report not found"}), 404

    data = request.get_json()
    if not data or not data.get("user_id"):
        return jsonify({"error": "user_id is required"}), 400

    assignee = db.session.get(User, data["user_id"])
    if not assignee:
        return jsonify({"error": "Assignee not found"}), 404

    report.assigned_to = data["user_id"]
    db.session.commit()

    return jsonify(report.to_dict()), 200

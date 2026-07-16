from flask import Blueprint, jsonify, request

from app.middleware.auth import admin_required, login_required
from app.mongo.attachment import Attachment
from app.mongo.audit_log import AuditLog
from app.schemas.report_schema import (
    CommentSchema,
    CreateReportSchema,
    ReportResponseSchema,
    StatusUpdateSchema,
    VoteSchema,
)
from app.services.report_service import ReportService

reports_bp = Blueprint("reports", __name__, url_prefix="/api/reports")


@reports_bp.route("", methods=["GET"])
@login_required
def list_reports():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    status = request.args.get("status")
    category_id = request.args.get("category_id", type=int)
    user_id = request.args.get("user_id", type=int)

    result = ReportService.get_all(
        page=page,
        per_page=per_page,
        status=status,
        category_id=category_id,
        user_id=user_id,
    )
    return jsonify(result), 200


@reports_bp.route("", methods=["POST"])
@login_required
def create_report():
    schema = CreateReportSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    try:
        data = schema.load(request.json)
        report = ReportService.create(
            title=data["title"],
            description=data["description"],
            user_id=request.current_user.id,
            category_id=data["category_id"],
            location=data.get("location"),
            is_anonymous=data.get("is_anonymous", False),
        )
        return jsonify(report.to_dict()), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@reports_bp.route("/<int:report_id>", methods=["GET"])
@login_required
def get_report(report_id: int):
    try:
        report = ReportService.get_by_id(report_id)
        data = report.to_dict()
        data["votes_count"] = len(report.votes)
        data["comments_count"] = len(report.comments)
        data["comments"] = [
            {
                "id": c.id,
                "body": c.body,
                "user_id": c.user_id,
                "author_name": c.author.name if c.author else None,
                "created_at": c.created_at.isoformat(),
            }
            for c in report.comments
        ]
        data["attachments"] = [
            Attachment.to_dict(a) for a in Attachment.find_by_report(report_id)
        ]
        data["status_history"] = [
            AuditLog.to_dict(log)
            for log in AuditLog.find_by_entity("report", report_id)
            if log.get("action") == "status_change"
        ]
        return jsonify(data), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404


@reports_bp.route("/<int:report_id>/status", methods=["PATCH"])
@admin_required
def update_status(report_id: int):
    schema = StatusUpdateSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    try:
        data = schema.load(request.json)
        report = ReportService.update_status(
            report_id=report_id,
            new_status=data["status"],
            admin_id=request.current_user.id,
        )
        return jsonify(report.to_dict()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@reports_bp.route("/<int:report_id>/vote", methods=["POST"])
@login_required
def vote(report_id: int):
    schema = VoteSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    try:
        data = schema.load(request.json)
        result = ReportService.vote(
            report_id=report_id,
            user_id=request.current_user.id,
            vote_type=data["vote_type"],
        )
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@reports_bp.route("/<int:report_id>/comments", methods=["POST"])
@login_required
def add_comment(report_id: int):
    schema = CommentSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    try:
        data = schema.load(request.json)
        comment = ReportService.add_comment(
            report_id=report_id,
            user_id=request.current_user.id,
            body=data["body"],
        )
        return jsonify(comment.to_dict()), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

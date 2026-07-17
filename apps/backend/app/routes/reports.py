"""
Report routes.

Handles CRUD operations for reports, status transitions, voting, and comments.
"""

from flask import Blueprint, jsonify, request

from app.middleware.auth import admin_required, login_required
from app.mongodb.attachment import Attachment
from app.mongodb.audit_log import AuditLog
from app.schemas.report_schema import (
    CommentSchema,
    CreateReportSchema,
    StatusUpdateSchema,
    VoteSchema,
)
from app.services.report_service import ReportService
from app.models.vote import Vote

reports_bp = Blueprint("reports", __name__, url_prefix="/api/reports")


@reports_bp.route("", methods=["GET"])
@login_required
def list_reports():
    """
    List reports with optional filters and pagination.

    Query parameters: page, per_page, status, category_id, user_id,
    date_from, date_to.

    Returns:
        tuple: JSON paginated response with reports list, HTTP 200.
    """

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    status = request.args.get("status")
    category_id = request.args.get("category_id", type=int)
    user_id = request.args.get("user_id", type=int)
    date_from = request.args.get("date_from")
    date_to = request.args.get("date_to")

    result = ReportService.get_all(
        page=page,
        per_page=per_page,
        status=status,
        category_id=category_id,
        user_id=user_id,
        current_user_id=request.current_user.id,
        date_from=date_from,
        date_to=date_to,
    )
    return jsonify(result), 200


@reports_bp.route("", methods=["POST"])
@login_required
def create_report():
    """
    Create a new report.

    Request body is validated against CreateReportSchema. Supports anonymous
    reporting via the is_anonymous field.

    Returns:
        tuple: JSON response with the created report, HTTP 201.
    """

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
    """
    Get detailed information about a specific report.

    Includes votes, comments, attachments, and status history.

    Args:
        report_id: The report's unique identifier.

    Returns:
        tuple: JSON response with full report details, HTTP 200.
    """

    try:
        report = ReportService.get_by_id(report_id)
        data = report.to_dict()
        data["votes_count"] = len(report.votes)
        data["upvotes"] = sum(1 for v in report.votes if v.vote_type == "up")
        data["downvotes"] = sum(1 for v in report.votes if v.vote_type == "down")
        data["comments_count"] = len(report.comments)
        user_vote = Vote.query.filter_by(
            user_id=request.current_user.id, report_id=report_id
        ).first()
        data["user_vote"] = user_vote.vote_type if user_vote else None
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
    """
    Update a report's status (admin only).

    Validates the status transition and logs the change in the audit log.
    An optional comment can be included.

    Args:
        report_id: The report's unique identifier.

    Returns:
        tuple: JSON response with the updated report, HTTP 200.
    """

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
            comment=data.get("comment"),
        )
        return jsonify(report.to_dict()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@reports_bp.route("/<int:report_id>/vote", methods=["POST"])
@login_required
def vote(report_id: int):
    """
    Vote on a report (up or down).

    Supports upsert: if the user already voted with a different type, the
    vote is updated. Self-voting is not allowed.

    Args:
        report_id: The report's unique identifier.

    Returns:
        tuple: JSON response with updated upvotes and downvotes counts, HTTP 200.
    """

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
    """
    Add a comment to a report.

    Args:
        report_id: The report's unique identifier.

    Returns:
        tuple: JSON response with the created comment, HTTP 201.
    """
    
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

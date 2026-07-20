"""
Report service layer.

Handles report CRUD operations, status transitions, voting, and comments.
"""

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import desc

from app.extensions import db
from app.models.category import Category
from app.models.comment import Comment
from app.models.report import Report
from app.models.user import User
from app.models.vote import Vote
from app.mongodb.attachment import Attachment

from app.mongodb.audit_log import AuditLog

class ReportService:
    """Service for report management operations."""

    @staticmethod
    def create(
        title: str,
        description: str,
        user_id: int,
        category_id: int,
        location: Optional[str] = None,
        is_anonymous: bool = False,
    ) -> Report:
        """
        Create a new report.

        Args:
            title: Report title (5-200 characters).
            description: Detailed description (minimum 10 characters).
            user_id: ID of the author.
            category_id: ID of the category.
            location: Location within the community (optional).
            is_anonymous: Whether to hide the author's identity.

        Returns:
            Report: The newly created Report instance.

        Raises:
            ValueError: If the category is not found.
        """

        user = db.session.get(User, user_id)
        if not user:
            raise ValueError("User not found")
        if user.role == "admin":
            raise ValueError("Admins cannot create reports")

        category = db.session.get(Category, category_id)
        if not category:
            raise ValueError("Category not found")

        report = Report(
            title=title,
            description=description,
            user_id=user_id,
            category_id=category_id,
            location=location,
            is_anonymous=is_anonymous,
            tracking_number=Report.generate_tracking_number(),
        )
        db.session.add(report)
        db.session.commit()

        AuditLog.create(
            user_id=user_id,
            action="create",
            entity_type="report",
            entity_id=report.id,
            details={"title": title, "category_id": category_id, "is_anonymous": is_anonymous},
        )

        return report

    @staticmethod
    def get_all(
        page: int = 1,
        per_page: int = 20,
        status: Optional[str] = None,
        category_id: Optional[int] = None,
        user_id: Optional[int] = None,
        current_user_id: Optional[int] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
    ) -> dict:
        """
        List reports with optional filters and pagination.

        Args:
            page: Page number (default: 1).
            per_page: Items per page (default: 20).
            status: Filter by status (open, in_progress, resolved, closed).
            category_id: Filter by category ID.
            user_id: Filter by author ID.
            current_user_id: ID of the requesting user (for user_vote field).
            date_from: Filter reports created on or after this date (ISO format).
            date_to: Filter reports created on or before this date (ISO format).

        Returns:
            dict: Paginated response with reports, total, page, per_page, and pages.
        """

        query = Report.query

        if status:
            query = query.filter_by(status=status)
        if category_id:
            query = query.filter_by(category_id=category_id)
        if user_id:
            query = query.filter_by(user_id=user_id)
        if date_from:
            query = query.filter(Report.created_at >= datetime.fromisoformat(date_from))
        if date_to:
            query = query.filter(Report.created_at <= datetime.fromisoformat(date_to))

        query = query.order_by(desc(Report.created_at))
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        reports = []
        for report in pagination.items:
            r = report.to_dict(current_user_id=current_user_id)
            r["votes_count"] = len(report.votes)
            r["upvotes"] = sum(1 for v in report.votes if v.vote_type == "up")
            r["downvotes"] = sum(1 for v in report.votes if v.vote_type == "down")
            r["comments_count"] = len(report.comments)
            if current_user_id:
                user_vote = Vote.query.filter_by(
                    user_id=current_user_id, report_id=report.id
                ).first()
                r["user_vote"] = user_vote.vote_type if user_vote else None
            else:
                r["user_vote"] = None
            reports.append(r)

        return {
            "reports": reports,
            "total": pagination.total,
            "page": pagination.page,
            "per_page": pagination.per_page,
            "pages": pagination.pages,
        }

    @staticmethod
    def get_by_id(report_id: int) -> Report:
        """
        Retrieve a single report by its ID.

        Args:
            report_id: The report's unique identifier.

        Returns:
            Report: The Report instance with related votes and comments.

        Raises:
            ValueError: If the report is not found.
        """

        report = db.session.get(Report, report_id)
        if not report:
            raise ValueError("Report not found")
        return report

    @staticmethod
    def update_status(report_id: int, new_status: str, admin_id: int, comment: Optional[str] = None) -> Report:
        """
        Transition a report to a new status.

        Valid transitions: open -> in_progress, open→closed, in_progress -> resolved,
        in_progress -> closed, resolved -> closed.

        Args:
            report_id: The report's unique identifier.
            new_status: The target status value.
            admin_id: ID of the admin performing the change.
            comment: Optional explanation for the status change.

        Returns:
            Report: The updated Report instance.

        Raises:
            ValueError: If the report is not found or the transition is invalid.
        """

        report = db.session.get(Report, report_id)
        if not report:
            raise ValueError("Report not found")

        valid_transitions = {
            "open": ["in_progress", "closed"],
            "in_progress": ["resolved", "closed"],
            "resolved": ["closed"],
            "closed": [],
        }

        if new_status not in valid_transitions.get(report.status, []):
            raise ValueError(
                f"Invalid transition from {report.status} to {new_status}"
            )

        old_status = report.status
        report.status = new_status
        report.updated_at = datetime.now(timezone.utc)
        db.session.commit()

        details = {"from": old_status, "to": new_status}
        if comment:
            details["comment"] = comment
        AuditLog.create(
            user_id=admin_id,
            action="status_change",
            entity_type="report",
            entity_id=report.id,
            details=details,
        )

        return report

    @staticmethod
    def vote(report_id: int, user_id: int, vote_type: str) -> dict:
        """
        Vote on a report. Supports upsert (changing vote type).

        Users cannot vote on their own report. If the user already voted with a
        different type, the existing vote is updated (upsert). Duplicate votes
        with the same type are rejected.

        Args:
            report_id: The report's unique identifier.
            user_id: ID of the voter.
            vote_type: "up" or "down".

        Returns:
            dict: Updated upvotes and downvotes counts.

        Raises:
            ValueError: If the report is not found, user tries to self-vote,
                or duplicate vote with the same type.
        """

        report = db.session.get(Report, report_id)
        if not report:
            raise ValueError("Report not found")

        if report.user_id == user_id:
            raise ValueError("Cannot vote on own report")

        existing = Vote.query.filter_by(user_id=user_id, report_id=report_id).first()
        if existing:
            if existing.vote_type == vote_type:
                raise ValueError("Already voted with the same type")
            existing.vote_type = vote_type
        else:
            vote = Vote(user_id=user_id, report_id=report_id, vote_type=vote_type)
            db.session.add(vote)
        db.session.commit()

        upvotes = Vote.query.filter_by(report_id=report_id, vote_type="up").count()
        downvotes = Vote.query.filter_by(report_id=report_id, vote_type="down").count()

        return {"upvotes": upvotes, "downvotes": downvotes, "user_vote": vote_type}

    @staticmethod
    def add_comment(report_id: int, user_id: int, body: str) -> Comment:
        """
        Add a comment to a report.

        Args:
            report_id: The report's unique identifier.
            user_id: ID of the comment author.
            body: Comment text (minimum 1 character).

        Returns:
            Comment: The newly created Comment instance.

        Raises:
            ValueError: If the report is not found.
        """
        
        report = db.session.get(Report, report_id)
        if not report:
            raise ValueError("Report not found")

        comment = Comment(body=body, user_id=user_id, report_id=report_id)
        db.session.add(comment)
        db.session.commit()

        AuditLog.create(
            user_id=user_id,
            action="create",
            entity_type="comment",
            entity_id=comment.id,
            details={"report_id": report_id},
        )

        return comment

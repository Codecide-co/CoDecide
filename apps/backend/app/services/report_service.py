from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import desc

from app.extensions import db
from app.models.category import Category
from app.models.comment import Comment
from app.models.report import Report
from app.models.user import User
from app.models.vote import Vote
from app.mongo.attachment import Attachment
from app.mongo.audit_log import AuditLog


class ReportService:

    @staticmethod
    def create(
        title: str,
        description: str,
        user_id: int,
        category_id: int,
        location: Optional[str] = None,
        is_anonymous: bool = False,
    ) -> Report:
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
    ) -> dict:
        query = Report.query

        if status:
            query = query.filter_by(status=status)
        if category_id:
            query = query.filter_by(category_id=category_id)
        if user_id:
            query = query.filter_by(user_id=user_id)

        query = query.order_by(desc(Report.created_at))
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        reports = []
        for report in pagination.items:
            r = report.to_dict()
            r["votes_count"] = len(report.votes)
            r["upvotes"] = sum(1 for v in report.votes if v.vote_type == "up")
            r["downvotes"] = sum(1 for v in report.votes if v.vote_type == "down")
            r["comments_count"] = len(report.comments)
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
        report = db.session.get(Report, report_id)
        if not report:
            raise ValueError("Report not found")
        return report

    @staticmethod
    def update_status(report_id: int, new_status: str, admin_id: int, comment: Optional[str] = None) -> Report:
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

        return {"upvotes": upvotes, "downvotes": downvotes}

    @staticmethod
    def add_comment(report_id: int, user_id: int, body: str) -> Comment:
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

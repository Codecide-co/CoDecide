from datetime import datetime, timedelta, timezone

from app.extensions import db
from app.models.comment import Comment
from app.models.report import Report
from app.models.user import User
from app.models.vote import Vote


class StatsService:

    @staticmethod
    def get_community_stats() -> dict:
        total_reports = Report.query.count()
        open_reports = Report.query.filter_by(status="open").count()
        in_progress = Report.query.filter_by(status="in_progress").count()
        resolved = Report.query.filter_by(status="resolved").count()
        closed = Report.query.filter_by(status="closed").count()

        categories = (
            db.session.query(Report.category_id, db.func.count(Report.id))
            .group_by(Report.category_id)
            .all()
        )

        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        resolved_today = Report.query.filter(
            Report.status == "resolved",
            Report.updated_at >= today,
        ).count()

        total_votes = Vote.query.count()
        total_comments = Comment.query.count()
        active_users = User.query.filter(User.last_seen >= today).count()
        total_users = User.query.count()

        return {
            "total_reports": total_reports,
            "by_status": {
                "open": open_reports,
                "in_progress": in_progress,
                "resolved": resolved,
                "closed": closed,
            },
            "by_category": {
                str(cat_id): count for cat_id, count in categories
            },
            "resolved_today": resolved_today,
            "total_votes": total_votes,
            "total_comments": total_comments,
            "active_users": active_users,
            "total_users": total_users,
        }

    @staticmethod
    def get_reports_by_status() -> dict:
        statuses = ["open", "in_progress", "resolved", "closed"]
        return {
            s: Report.query.filter_by(status=s).count() for s in statuses
        }

    @staticmethod
    def get_reports_by_category() -> list:
        results = (
            db.session.query(Report.category_id, db.func.count(Report.id))
            .group_by(Report.category_id)
            .all()
        )
        return [{"category_id": cat_id, "count": count} for cat_id, count in results]

    @staticmethod
    def get_reports_over_time(days: int = 30) -> list:
        since = datetime.now(timezone.utc) - timedelta(days=days)
        results = (
            db.session.query(
                db.func.date(Report.created_at).label("date"),
                db.func.count(Report.id).label("count"),
            )
            .filter(Report.created_at >= since)
            .group_by(db.func.date(Report.created_at))
            .order_by(db.func.date(Report.created_at))
            .all()
        )
        return [{"date": str(r.date), "count": r.count} for r in results]

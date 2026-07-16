"""
Community statistics service layer.

Aggregates metrics about reports, votes, comments, and user activity.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from app.extensions import db
from app.models.comment import Comment
from app.models.report import Report
from app.models.user import User
from app.models.vote import Vote


class StatsService:
    """Service for computing community-wide statistics."""

    @staticmethod
    def get_community_stats() -> dict:
        """
        Get comprehensive community metrics.

        Returns:
            dict: Aggregated statistics including total reports by status and
                category, resolved today, votes, comments, and user activity.
        """

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
            "avg_resolution_time": StatsService.get_avg_resolution_time(),
            "total_votes": total_votes,
            "total_comments": total_comments,
            "active_users": active_users,
            "total_users": total_users,
        }

    @staticmethod
    def get_reports_by_status() -> dict:
        """
        Get report counts grouped by status.

        Returns:
            dict: Mapping of status names to report counts.
        """

        statuses = ["open", "in_progress", "resolved", "closed"]
        return {
            s: Report.query.filter_by(status=s).count() for s in statuses
        }

    @staticmethod
    def get_reports_by_category() -> list:
        """
        Get report counts grouped by category.

        Returns:
            list: List of dicts with category_id and count.
        """

        results = (
            db.session.query(Report.category_id, db.func.count(Report.id))
            .group_by(Report.category_id)
            .all()
        )
        return [{"category_id": cat_id, "count": count} for cat_id, count in results]

    @staticmethod
    def get_avg_resolution_time() -> Optional[float]:
        """
        Calculate the average resolution time for resolved/closed reports.

        Computes the average time in hours between creation and last update
        for reports with a final status (resolved or closed).

        Returns:
            Optional[float]: Average resolution time in hours, or None if no
                resolved/closed reports exist.
        """

        resolved = Report.query.filter(
            Report.status.in_(["resolved", "closed"])
        ).all()

        if not resolved:
            return None

        total_hours = 0.0
        for r in resolved:
            delta = r.updated_at - r.created_at
            total_hours += delta.total_seconds() / 3600

        return round(total_hours / len(resolved), 2)

    @staticmethod
    def get_top_voted_reports(limit: int = 5) -> list:
        """
        Get the top voted reports by total vote count.

        Args:
            limit: Maximum number of reports to return (default: 5).

        Returns:
            list: List of dicts with report id, title, tracking_number,
                upvotes and downvotes, sorted by total votes descending.
        """

        reports = Report.query.all()
        scored = []
        for report in reports:
            up = sum(1 for v in report.votes if v.vote_type == "up")
            down = sum(1 for v in report.votes if v.vote_type == "down")
            scored.append({
                "id": report.id,
                "title": report.title,
                "tracking_number": report.tracking_number,
                "upvotes": up,
                "downvotes": down,
                "total_votes": up + down,
            })

        scored.sort(key=lambda r: r["total_votes"], reverse=True)
        return scored[:limit]

    @staticmethod
    def get_reports_over_time(days: int = 30) -> list:
        """
        Get report creation counts per day over a period.

        Args:
            days: Number of days to look back (default: 30).

        Returns:
            list: List of dicts with date and count for each day.
        """
        
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

from app.extensions import db
from app.models.report import Report


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

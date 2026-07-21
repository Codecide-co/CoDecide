"""Unit tests for StatsService."""

import pytest
from werkzeug.security import generate_password_hash

from app.extensions import db
from app.models.category import Category
from app.models.comment import Comment
from app.models.report import Report
from app.models.user import User
from app.models.vote import Vote
from app.services.stats_service import StatsService


def _clean():
    for m in [Vote, Comment, Report, Category, User]:
        m.query.delete()
    db.session.commit()


@pytest.fixture
def ctx(app):
    with app.app_context():
        db.create_all()
        _clean()
        yield
        _clean()


@pytest.fixture
def uid(ctx):
    u = User(name="Test", email="t@t.com",
             password_hash=generate_password_hash("p"), role="resident")
    db.session.add(u)
    db.session.commit()
    return u.id


@pytest.fixture
def cat_a(ctx):
    c = Category(name="Infra", type="infrastructure")
    db.session.add(c)
    db.session.commit()
    return c.id


@pytest.fixture
def cat_b(ctx):
    c = Category(name="Noise", type="coexistence")
    db.session.add(c)
    db.session.commit()
    return c.id


def _report(title, uid, cat_id, status="open"):
    r = Report(title=title, description="D", user_id=uid,
               category_id=cat_id, status=status,
               tracking_number=Report.generate_tracking_number())
    db.session.add(r)
    db.session.commit()
    return r.id


class TestCommunityStats:
    def test_empty_database(self, ctx):
        stats = StatsService.get_community_stats()

        assert stats["total_reports"] == 0
        assert stats["by_status"] == {"open": 0, "in_progress": 0,
                                       "resolved": 0, "closed": 0}
        assert stats["by_category"] == {}
        assert stats["total_votes"] == 0
        assert stats["total_comments"] == 0
        assert stats["total_users"] == 0
        assert stats["active_users"] == 0
        assert stats["avg_resolution_time"] is None
        assert stats["resolved_today"] == 0

    def test_with_multiple_reports(self, uid, cat_a, cat_b):
        with db.session.no_autoflush:
            for i in range(3):
                _report(f"Open {i}", uid, cat_a, "open")
            for i in range(2):
                _report(f"Prog {i}", uid, cat_a, "in_progress")
            _report("Resolved", uid, cat_b, "resolved")
            _report("Closed", uid, cat_b, "closed")

        stats = StatsService.get_community_stats()

        assert stats["total_reports"] == 7
        assert stats["by_status"]["open"] == 3
        assert stats["by_status"]["in_progress"] == 2
        assert stats["by_status"]["resolved"] == 1
        assert stats["by_status"]["closed"] == 1
        assert str(cat_a) in stats["by_category"]
        assert str(cat_b) in stats["by_category"]
        assert stats["total_users"] >= 1

    def test_votes_and_comments_included(self, uid, cat_a):
        rid = _report("R", uid, cat_a)
        db.session.add(Vote(user_id=uid, report_id=rid, vote_type="up"))
        db.session.add(Comment(body="Nice", user_id=uid, report_id=rid))
        db.session.commit()

        stats = StatsService.get_community_stats()

        assert stats["total_votes"] == 1
        assert stats["total_comments"] == 1


class TestReportsByStatus:
    def test_various_statuses(self, uid, cat_a):
        for s in ["open", "open", "in_progress", "resolved", "closed"]:
            _report("R", uid, cat_a, s)

        result = StatsService.get_reports_by_status()

        assert result == {"open": 2, "in_progress": 1,
                          "resolved": 1, "closed": 1}

    def test_empty_returns_zeros(self, ctx):
        result = StatsService.get_reports_by_status()

        assert result == {"open": 0, "in_progress": 0,
                          "resolved": 0, "closed": 0}


class TestReportsByCategory:
    def test_multiple_categories(self, uid, cat_a, cat_b):
        _report("A1", uid, cat_a)
        _report("A2", uid, cat_a)
        _report("B1", uid, cat_b)

        result = StatsService.get_reports_by_category()

        assert len(result) == 2
        counts = {r["category_id"]: r["count"] for r in result}
        assert counts[cat_a] == 2
        assert counts[cat_b] == 1

    def test_empty_returns_empty_list(self, ctx):
        result = StatsService.get_reports_by_category()

        assert result == []


class TestAggregation:
    def test_correct_counts(self, uid, cat_a):
        u2 = User(name="Voter", email="v@v.com",
                  password_hash=generate_password_hash("p"), role="resident")
        db.session.add(u2)
        db.session.commit()
        rid = _report("R", uid, cat_a)
        db.session.add(Vote(user_id=uid, report_id=rid, vote_type="up"))
        db.session.add(Vote(user_id=u2.id, report_id=rid, vote_type="down"))
        db.session.add(Comment(body="C1", user_id=uid, report_id=rid))
        db.session.add(Comment(body="C2", user_id=uid, report_id=rid))
        db.session.commit()

        stats = StatsService.get_community_stats()
        by_status = StatsService.get_reports_by_status()
        by_cat = StatsService.get_reports_by_category()

        assert stats["total_reports"] == 1
        assert stats["total_votes"] == 2
        assert stats["total_comments"] == 2
        assert by_status["open"] == 1
        assert len(by_cat) == 1
        assert by_cat[0]["count"] == 1

    def test_avg_resolution_time(self, uid, cat_a):
        from datetime import datetime, timedelta, timezone

        now = datetime.now(timezone.utc)
        r = Report(title="R", description="D", user_id=uid, category_id=cat_a,
                   status="resolved", tracking_number=Report.generate_tracking_number(),
                   created_at=now - timedelta(hours=4),
                   updated_at=now)
        db.session.add(r)
        db.session.commit()

        avg = StatsService.get_avg_resolution_time()

        assert avg is not None
        assert avg == 4.0

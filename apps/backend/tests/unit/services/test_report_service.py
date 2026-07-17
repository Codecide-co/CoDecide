"""Unit tests for ReportService."""

from unittest.mock import patch

import pytest
from werkzeug.security import generate_password_hash

from app.extensions import db
from app.models.category import Category
from app.models.comment import Comment
from app.models.report import Report
from app.models.user import User
from app.models.vote import Vote
from app.services.report_service import ReportService

MOCK_AUDIT = patch("app.services.report_service.AuditLog.create", autospec=True)


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
def user_id(ctx):
    u = User(name="Test User", email="test@example.com",
             password_hash=generate_password_hash("pass"), role="resident")
    db.session.add(u)
    db.session.commit()
    return u.id


@pytest.fixture
def other_id(ctx):
    u = User(name="Other", email="other@example.com",
             password_hash=generate_password_hash("pass"), role="resident")
    db.session.add(u)
    db.session.commit()
    return u.id


@pytest.fixture
def admin_id(ctx):
    u = User(name="Admin", email="admin@example.com",
             password_hash=generate_password_hash("pass"), role="admin")
    db.session.add(u)
    db.session.commit()
    return u.id


@pytest.fixture
def cat_id(ctx):
    c = Category(name="Pothole", type="infrastructure")
    db.session.add(c)
    db.session.commit()
    return c.id


class TestCreate:
    def test_valid_creation(self, app, user_id, cat_id):
        with MOCK_AUDIT:
            with app.app_context():
                report = ReportService.create(
                    title="Broken streetlight",
                    description="The light on Main St is out",
                    user_id=user_id,
                    category_id=cat_id,
                    location="Main St 123",
                    is_anonymous=False,
                )

        assert report.title == "Broken streetlight"
        assert report.description == "The light on Main St is out"
        assert report.user_id == user_id
        assert report.category_id == cat_id
        assert report.location == "Main St 123"
        assert report.is_anonymous is False
        assert report.status == "open"
        assert report.tracking_number.startswith("CD-")

    def test_invalid_category_raises_error(self, app, user_id):
        with app.app_context():
            with pytest.raises(ValueError, match="Category not found"):
                ReportService.create(
                    title="Broken streetlight",
                    description="The light is out",
                    user_id=user_id,
                    category_id=999,
                )

    def test_audit_log_created_on_create(self, app, user_id, cat_id):
        with patch("app.services.report_service.AuditLog.create") as mock:
            with app.app_context():
                report = ReportService.create(
                    title="Test report",
                    description="Description for test",
                    user_id=user_id,
                    category_id=cat_id,
                )

            mock.assert_called_once_with(
                user_id=user_id, action="create", entity_type="report",
                entity_id=report.id,
                details={"title": "Test report", "category_id": cat_id,
                         "is_anonymous": False},
            )


class TestGetAll:
    def test_empty_list(self, app):
        with app.app_context():
            result = ReportService.get_all()

        assert result["reports"] == []
        assert result["total"] == 0
        assert result["page"] == 1
        assert result["per_page"] == 20
        assert result["pages"] == 0

    def test_pagination(self, app, user_id, cat_id):
        with MOCK_AUDIT:
            with app.app_context():
                for i in range(5):
                    ReportService.create(
                        title=f"Report {i}", description=f"Desc {i}",
                        user_id=user_id, category_id=cat_id,
                    )

        with app.app_context():
            p1 = ReportService.get_all(page=1, per_page=2)
            p2 = ReportService.get_all(page=2, per_page=2)

        assert len(p1["reports"]) == 2
        assert p1["total"] == 5
        assert p1["pages"] == 3
        assert len(p2["reports"]) == 2

    def test_filter_by_status(self, app, user_id, cat_id):
        with MOCK_AUDIT:
            with app.app_context():
                ReportService.create(
                    title="Open r", description="D",
                    user_id=user_id, category_id=cat_id,
                )
                r2 = ReportService.create(
                    title="Closed r", description="D",
                    user_id=user_id, category_id=cat_id,
                )
                r2.status = "closed"
                db.session.commit()

        with app.app_context():
            o = ReportService.get_all(status="open")
            c = ReportService.get_all(status="closed")

        assert len(o["reports"]) == 1
        assert o["reports"][0]["title"] == "Open r"
        assert len(c["reports"]) == 1
        assert c["reports"][0]["title"] == "Closed r"

    def test_filter_by_category(self, app, user_id, cat_id):
        with MOCK_AUDIT:
            with app.app_context():
                c2 = Category(name="Noise", type="coexistence")
                db.session.add(c2)
                db.session.commit()
                ReportService.create(
                    title="R1", description="D",
                    user_id=user_id, category_id=cat_id,
                )
                ReportService.create(
                    title="R2", description="D",
                    user_id=user_id, category_id=c2.id,
                )

        with app.app_context():
            r = ReportService.get_all(category_id=cat_id)

        assert len(r["reports"]) == 1
        assert r["reports"][0]["title"] == "R1"

    def test_filter_by_user(self, app, user_id, other_id, cat_id):
        with MOCK_AUDIT:
            with app.app_context():
                ReportService.create(
                    title="Mine", description="D",
                    user_id=user_id, category_id=cat_id,
                )
                ReportService.create(
                    title="Theirs", description="D",
                    user_id=other_id, category_id=cat_id,
                )

        with app.app_context():
            r = ReportService.get_all(user_id=user_id)

        assert len(r["reports"]) == 1
        assert r["reports"][0]["title"] == "Mine"


class TestGetById:
    def test_existing(self, app, user_id, cat_id):
        with MOCK_AUDIT:
            with app.app_context():
                created = ReportService.create(
                    title="My report", description="D",
                    user_id=user_id, category_id=cat_id,
                )
                fetched = ReportService.get_by_id(created.id)

        assert fetched.id == created.id
        assert fetched.title == "My report"

    def test_non_existing_raises_error(self, app):
        with app.app_context():
            with pytest.raises(ValueError, match="Report not found"):
                ReportService.get_by_id(999)


class TestUpdateStatus:
    @pytest.mark.parametrize("fr,to", [
        ("open", "in_progress"), ("open", "closed"),
        ("in_progress", "resolved"), ("in_progress", "closed"),
        ("resolved", "closed"),
    ])
    def test_valid_transitions(self, app, user_id, cat_id, admin_id, fr, to):
        with MOCK_AUDIT:
            with app.app_context():
                r = ReportService.create(
                    title="T", description="D",
                    user_id=user_id, category_id=cat_id,
                )
                r.status = fr
                db.session.commit()
                rid = r.id

        with patch("app.services.report_service.AuditLog.create") as mock:
            with app.app_context():
                updated = ReportService.update_status(
                    report_id=rid, new_status=to, admin_id=admin_id,
                )

            assert updated.status == to
            mock.assert_called_once_with(
                user_id=admin_id, action="status_change",
                entity_type="report", entity_id=rid,
                details={"from": fr, "to": to},
            )

    def test_invalid_raises_error(self, app, user_id, cat_id, admin_id):
        with MOCK_AUDIT:
            with app.app_context():
                report = ReportService.create(
                    title="T", description="D",
                    user_id=user_id, category_id=cat_id,
                )

        with app.app_context():
            with pytest.raises(ValueError, match="Invalid transition"):
                ReportService.update_status(
                    report_id=report.id, new_status="resolved",
                    admin_id=admin_id,
                )

    def test_non_existing_raises_error(self, app, admin_id):
        with app.app_context():
            with pytest.raises(ValueError, match="Report not found"):
                ReportService.update_status(
                    report_id=999, new_status="in_progress",
                    admin_id=admin_id,
                )

    def test_with_comment(self, app, user_id, cat_id, admin_id):
        with MOCK_AUDIT:
            with app.app_context():
                report = ReportService.create(
                    title="T", description="D",
                    user_id=user_id, category_id=cat_id,
                )

        with patch("app.services.report_service.AuditLog.create") as mock:
            with app.app_context():
                ReportService.update_status(
                    report_id=report.id, new_status="in_progress",
                    admin_id=admin_id, comment="Investigating",
                )

            mock.assert_called_once_with(
                user_id=admin_id, action="status_change",
                entity_type="report", entity_id=report.id,
                details={"from": "open", "to": "in_progress",
                         "comment": "Investigating"},
            )


class TestVote:
    @pytest.fixture
    def report_id(self, app, user_id, cat_id):
        with MOCK_AUDIT:
            with app.app_context():
                r = ReportService.create(
                    title="T", description="D",
                    user_id=user_id, category_id=cat_id,
                )
                return r.id

    def test_upvote(self, app, report_id, other_id):
        with app.app_context():
            result = ReportService.vote(
                report_id=report_id, user_id=other_id, vote_type="up"
            )

        assert result == {"upvotes": 1, "downvotes": 0, "user_vote": "up"}

    def test_downvote(self, app, report_id, other_id):
        with app.app_context():
            result = ReportService.vote(
                report_id=report_id, user_id=other_id, vote_type="down"
            )

        assert result == {"upvotes": 0, "downvotes": 1, "user_vote": "down"}

    def test_upsert_changes_vote(self, app, report_id, other_id):
        with app.app_context():
            ReportService.vote(report_id=report_id, user_id=other_id,
                               vote_type="up")
            result = ReportService.vote(report_id=report_id, user_id=other_id,
                                        vote_type="down")

        assert result == {"upvotes": 0, "downvotes": 1, "user_vote": "down"}

    def test_duplicate_same_type_raises_error(self, app, report_id, other_id):
        with app.app_context():
            ReportService.vote(report_id=report_id, user_id=other_id,
                               vote_type="up")
            with pytest.raises(ValueError,
                               match="Already voted with the same type"):
                ReportService.vote(report_id=report_id, user_id=other_id,
                                   vote_type="up")

    def test_self_vote_raises_error(self, app, report_id, user_id):
        with app.app_context():
            with pytest.raises(ValueError, match="Cannot vote on own report"):
                ReportService.vote(report_id=report_id, user_id=user_id,
                                   vote_type="up")

    def test_non_existing_raises_error(self, app, other_id):
        with app.app_context():
            with pytest.raises(ValueError, match="Report not found"):
                ReportService.vote(report_id=999, user_id=other_id,
                                   vote_type="up")


class TestAddComment:
    @pytest.fixture
    def report_id(self, app, user_id, cat_id):
        with MOCK_AUDIT:
            with app.app_context():
                r = ReportService.create(
                    title="T", description="D",
                    user_id=user_id, category_id=cat_id,
                )
                return r.id

    def test_valid_comment(self, app, report_id, other_id):
        with patch("app.services.report_service.AuditLog.create") as mock:
            with app.app_context():
                comment = ReportService.add_comment(
                    report_id=report_id, user_id=other_id, body="Great work!",
                )

            assert comment.body == "Great work!"
            assert comment.user_id == other_id
            assert comment.report_id == report_id
            mock.assert_called_once_with(
                user_id=other_id, action="create", entity_type="comment",
                entity_id=comment.id, details={"report_id": report_id},
            )

    def test_non_existing_raises_error(self, app, other_id):
        with app.app_context():
            with pytest.raises(ValueError, match="Report not found"):
                ReportService.add_comment(
                    report_id=999, user_id=other_id, body="Hello",
                )

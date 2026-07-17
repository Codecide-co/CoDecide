"""Integration tests for report endpoints."""

from unittest.mock import patch

import pytest

from app.extensions import db
from app.models.category import Category
from app.models.user import User


BASE = "/api/reports"
MOCK_AUDIT_CREATE = patch("app.routes.reports.AuditLog.create", autospec=True)
MOCK_AUDIT_FIND = patch("app.routes.reports.AuditLog.find_by_entity",
                        return_value=[])
MOCK_ATTACHMENT = patch("app.routes.reports.Attachment.find_by_report",
                        return_value=[])


@pytest.fixture
def clean_db(app):
    with app.app_context():
        for m in [Category, User]:
            m.query.delete()
        db.session.commit()


@pytest.fixture
def resident(client, clean_db):
    client.post("/api/auth/register", json={
        "name": "Res", "email": "res@t.com", "password": "password123",
    })
    r = client.post("/api/auth/login", json={
        "email": "res@t.com", "password": "password123",
    })
    token = r.get_json()["token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin(client, app, clean_db):
    import werkzeug.security
    with app.app_context():
        u = User(name="Adm", email="adm@t.com",
                 password_hash=werkzeug.security.generate_password_hash("pass"),
                 role="admin")
        db.session.add(u)
        db.session.commit()
    r = client.post("/api/auth/login", json={
        "email": "adm@t.com", "password": "pass",
    })
    token = r.get_json()["token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def voter(client, clean_db):
    client.post("/api/auth/register", json={
        "name": "Voter", "email": "vote@t.com", "password": "password123",
    })
    r = client.post("/api/auth/login", json={
        "email": "vote@t.com", "password": "password123",
    })
    token = r.get_json()["token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def cat_id(app, clean_db):
    with app.app_context():
        c = Category(name="Infra", type="infrastructure")
        db.session.add(c)
        db.session.commit()
        return c.id


@pytest.fixture
def report_id(client, resident, cat_id):
    with MOCK_AUDIT_CREATE:
        r = client.post(BASE, json={
            "title": "Streetlight out",
            "description": "The light on Main St has been broken for days",
            "category_id": cat_id,
        }, headers=resident)
    return r.get_json()["id"]


@pytest.fixture
def report_id_other(client, resident, cat_id):
    with MOCK_AUDIT_CREATE:
        r = client.post(BASE, json={
            "title": "Pothole on 5th Ave",
            "description": "Large pothole on the corner of 5th Ave",
            "category_id": cat_id,
        }, headers=resident)
    return r.get_json()["id"]


@pytest.fixture
def admin_report_id(client, admin, cat_id):
    with MOCK_AUDIT_CREATE:
        r = client.post(BASE, json={
            "title": "Admin report",
            "description": "Report created by admin for status tests",
            "category_id": cat_id,
        }, headers=admin)
    return r.get_json()["id"]


class TestListReports:
    def test_paginated_list(self, client, resident, report_id):
        resp = client.get(BASE, headers=resident)

        assert resp.status_code == 200
        data = resp.get_json()
        assert "reports" in data
        assert data["total"] >= 1
        assert data["page"] == 1

    def test_filter_by_status(self, client, resident, report_id_other,
                              admin, admin_report_id):
        with MOCK_AUDIT_CREATE:
            client.patch(f"{BASE}/{admin_report_id}/status", json={
                "status": "closed",
            }, headers=admin)

        resp = client.get(f"{BASE}?status=closed", headers=resident)

        assert resp.status_code == 200
        assert resp.get_json()["total"] >= 1

    def test_returns_401_without_token(self, client):
        resp = client.get(BASE)

        assert resp.status_code == 401


class TestCreateReport:
    def test_creates_and_returns_201(self, client, resident, cat_id):
        with MOCK_AUDIT_CREATE:
            resp = client.post(BASE, json={
                "title": "New broken pipe",
                "description": "Water pipe leaking on 2nd floor",
                "category_id": cat_id,
                "location": "Building A, Floor 2",
            }, headers=resident)

        assert resp.status_code == 201
        data = resp.get_json()
        assert data["title"] == "New broken pipe"
        assert data["status"] == "open"
        assert data["tracking_number"].startswith("CD-")

    def test_invalid_data_returns_400(self, client, resident):
        resp = client.post(BASE, json={
            "title": "Hi",
            "category_id": 999,
        }, headers=resident)

        assert resp.status_code == 400
        assert "error" in resp.get_json()


class TestGetReport:
    def test_returns_detail_with_comments_and_votes(self, client, resident,
                                                     report_id, cat_id):
        with MOCK_AUDIT_CREATE:
            client.post(f"{BASE}/{report_id}/comments", json={
                "body": "Good job on this",
            }, headers=resident)

        with patch("app.routes.reports.AuditLog.find_by_entity",
                   return_value=[]), \
             patch("app.routes.reports.Attachment.find_by_report",
                   return_value=[]):
            resp = client.get(f"{BASE}/{report_id}", headers=resident)

        assert resp.status_code == 200
        data = resp.get_json()
        assert data["id"] == report_id
        assert "comments" in data
        assert "votes_count" in data
        assert "attachments" in data

    def test_returns_404_for_non_existing(self, client, resident):
        resp = client.get(f"{BASE}/99999", headers=resident)

        assert resp.status_code == 404


class TestUpdateStatus:
    def test_admin_returns_200(self, client, admin, admin_report_id):
        with MOCK_AUDIT_CREATE:
            resp = client.patch(f"{BASE}/{admin_report_id}/status", json={
                "status": "in_progress",
            }, headers=admin)

        assert resp.status_code == 200
        assert resp.get_json()["status"] == "in_progress"

    def test_non_admin_returns_403(self, client, resident, report_id):
        resp = client.patch(f"{BASE}/{report_id}/status", json={
            "status": "in_progress",
        }, headers=resident)

        assert resp.status_code == 403

    def test_invalid_transition_returns_400(self, client, admin,
                                             admin_report_id):
        with MOCK_AUDIT_CREATE:
            resp = client.patch(f"{BASE}/{admin_report_id}/status", json={
                "status": "resolved",
            }, headers=admin)

        assert resp.status_code == 400
        assert "error" in resp.get_json()


class TestVote:
    def test_valid_vote_returns_200(self, client, voter, report_id):
        resp = client.post(f"{BASE}/{report_id}/vote", json={
            "vote_type": "up",
        }, headers=voter)

        assert resp.status_code == 200
        data = resp.get_json()
        assert data["upvotes"] >= 1
        assert data["user_vote"] == "up"

    def test_duplicate_vote_returns_error(self, client, voter, report_id):
        client.post(f"{BASE}/{report_id}/vote", json={
            "vote_type": "up",
        }, headers=voter)

        resp = client.post(f"{BASE}/{report_id}/vote", json={
            "vote_type": "up",
        }, headers=voter)

        assert resp.status_code == 400
        assert "error" in resp.get_json()


class TestAddComment:
    def test_returns_201(self, client, resident, report_id):
        with MOCK_AUDIT_CREATE:
            resp = client.post(f"{BASE}/{report_id}/comments", json={
                "body": "This is a test comment",
            }, headers=resident)

        assert resp.status_code == 201
        data = resp.get_json()
        assert data["body"] == "This is a test comment"
        assert data["report_id"] == report_id

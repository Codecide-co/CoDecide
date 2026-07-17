"""Integration tests for comunicados and admin endpoints."""

from unittest.mock import patch

import pytest
import werkzeug.security

from app.extensions import db
from app.models.user import User
from app.models.comunicado import Comunicado

COMUNICADOS_BASE = "/api/comunicados"
ADMIN_BASE = "/api/admin"

MOCK_AUDIT_CREATE = patch("app.routes.admin.AuditLog.create", autospec=True)
MOCK_AUDIT_FIND_ALL = patch("app.routes.admin.AuditLog.find_all", return_value=[])


@pytest.fixture
def clean_db(app):
    with app.app_context():
        db.session.execute(db.text("DELETE FROM reports"))
        for m in [Comunicado, User]:
            m.query.delete()
        db.session.commit()


@pytest.fixture
def resident_headers(client, clean_db):
    client.post("/api/auth/register", json={
        "name": "Res", "email": "res@t.com", "password": "password123",
    })
    r = client.post("/api/auth/login", json={
        "email": "res@t.com", "password": "password123",
    })
    token = r.get_json()["token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin_headers(client, app, clean_db):
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


class TestListComunicados:
    def test_returns_list_without_auth(self, client, clean_db):
        resp = client.get(COMUNICADOS_BASE)

        assert resp.status_code == 200
        assert isinstance(resp.get_json(), list)


class TestCreateComunicado:
    def test_admin_returns_201(self, client, admin_headers):
        resp = client.post(COMUNICADOS_BASE, json={
            "title": "Important notice",
            "body": "Pool closed for maintenance",
        }, headers=admin_headers)

        assert resp.status_code == 201
        data = resp.get_json()
        assert data["title"] == "Important notice"
        assert data["body"] == "Pool closed for maintenance"
        assert "author_id" in data
        assert "created_at" in data

    def test_non_admin_returns_403(self, client, resident_headers):
        resp = client.post(COMUNICADOS_BASE, json={
            "title": "Should not work",
            "body": "This will be rejected",
        }, headers=resident_headers)

        assert resp.status_code == 403

    def test_missing_fields_returns_400(self, client, admin_headers):
        resp = client.post(COMUNICADOS_BASE, json={
            "title": "Missing body",
        }, headers=admin_headers)

        assert resp.status_code == 400
        assert "error" in resp.get_json()


class TestListUsers:
    def test_admin_returns_user_list(self, client, admin_headers, resident_headers):
        resp = client.get(f"{ADMIN_BASE}/users", headers=admin_headers)

        assert resp.status_code == 200
        data = resp.get_json()
        assert isinstance(data, list)
        assert len(data) >= 2
        emails = [u["email"] for u in data]
        assert "adm@t.com" in emails
        assert "res@t.com" in emails

    def test_non_admin_returns_403(self, client, resident_headers):
        resp = client.get(f"{ADMIN_BASE}/users", headers=resident_headers)

        assert resp.status_code == 403


class TestDeleteUser:
    def test_admin_returns_200(self, client, app, admin_headers, clean_db):
        with app.app_context():
            u = User(name="ToDelete", email="delete@t.com",
                     password_hash=werkzeug.security.generate_password_hash("x"),
                     role="resident")
            db.session.add(u)
            db.session.commit()
            user_id = u.id

        with MOCK_AUDIT_CREATE:
            resp = client.delete(f"{ADMIN_BASE}/users/{user_id}",
                                 headers=admin_headers)

        assert resp.status_code == 200
        assert resp.get_json()["message"] == "User deleted"

    def test_non_admin_returns_403(self, client, resident_headers, admin_headers,
                                   app, clean_db):
        with app.app_context():
            u = User(name="ToDelete2", email="delete2@t.com",
                     password_hash=werkzeug.security.generate_password_hash("x"),
                     role="resident")
            db.session.add(u)
            db.session.commit()
            user_id = u.id

        resp = client.delete(f"{ADMIN_BASE}/users/{user_id}",
                             headers=resident_headers)

        assert resp.status_code == 403


class TestGetAuditLogs:
    def test_returns_logs(self, client, admin_headers):
        with MOCK_AUDIT_FIND_ALL:
            resp = client.get(f"{ADMIN_BASE}/audit-logs", headers=admin_headers)

        assert resp.status_code == 200
        assert isinstance(resp.get_json(), list)


class TestAssignReport:
    def test_assigns_report(self, client, app, admin_headers, clean_db):
        from app.models.category import Category
        from app.models.report import Report

        with app.app_context():
            cat = Category(name="Infra", type="infrastructure")
            db.session.add(cat)
            db.session.commit()
            cat_id = cat.id

            u = User(name="Assignee", email="assignee@t.com",
                     password_hash=werkzeug.security.generate_password_hash("x"),
                     role="admin")
            db.session.add(u)
            db.session.commit()
            admin_id = u.id

            report = Report(title="Test", description="Desc",
                            user_id=admin_id, category_id=cat_id,
                            tracking_number=Report.generate_tracking_number())
            db.session.add(report)
            db.session.commit()
            report_id = report.id

        with MOCK_AUDIT_CREATE:
            resp = client.patch(f"{ADMIN_BASE}/reports/{report_id}/assign",
                                json={"user_id": admin_id},
                                headers=admin_headers)

        assert resp.status_code == 200
        data = resp.get_json()
        assert data["id"] == report_id
        assert data["status"] == "open"

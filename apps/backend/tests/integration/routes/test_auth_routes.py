"""Integration tests for auth endpoints."""

import pytest

from app.extensions import db
from app.models.user import User


@pytest.fixture
def clean_db(app):
    with app.app_context():
        User.query.delete()
        db.session.commit()


class TestRegister:
    def test_valid_data_returns_201_and_jwt(self, client, clean_db):
        resp = client.post("/api/auth/register", json={
            "name": "Test User",
            "email": "newuser@example.com",
            "password": "password123",
            "apartment": "101",
            "tower": "A",
        })

        assert resp.status_code == 201
        data = resp.get_json()
        assert "id" in data
        assert data["name"] == "Test User"
        assert data["email"] == "newuser@example.com"
        assert data["role"] == "resident"
        assert "token" in data

    def test_duplicate_email_returns_409(self, client, clean_db):
        client.post("/api/auth/register", json={
            "name": "First", "email": "dup@example.com", "password": "pass123",
        })

        resp = client.post("/api/auth/register", json={
            "name": "Second", "email": "dup@example.com", "password": "pass456",
        })

        assert resp.status_code == 409
        assert resp.get_json()["error"] == "Email already registered"

    def test_missing_fields_returns_400(self, client, clean_db):
        resp = client.post("/api/auth/register", json={
            "email": "missing@example.com",
        })

        assert resp.status_code == 400
        data = resp.get_json()
        assert "error" in data


class TestLogin:
    def test_valid_credentials_returns_200_and_jwt(self, client, clean_db):
        client.post("/api/auth/register", json={
            "name": "Login Tester",
            "email": "logintest@example.com",
            "password": "securePass1",
        })

        resp = client.post("/api/auth/login", json={
            "email": "logintest@example.com",
            "password": "securePass1",
        })

        assert resp.status_code == 200
        data = resp.get_json()
        assert data["email"] == "logintest@example.com"
        assert "token" in data

    def test_invalid_email_returns_401(self, client, clean_db):
        resp = client.post("/api/auth/login", json={
            "email": "nobody@example.com",
            "password": "somepass",
        })

        assert resp.status_code == 401
        assert resp.get_json()["error"] == "Invalid email or password"

    def test_wrong_password_returns_401(self, client, clean_db):
        client.post("/api/auth/register", json={
            "name": "Pass Tester",
            "email": "passtest@example.com",
            "password": "correctPass1",
        })

        resp = client.post("/api/auth/login", json={
            "email": "passtest@example.com",
            "password": "wrongPassword",
        })

        assert resp.status_code == 401
        assert resp.get_json()["error"] == "Invalid email or password"


class TestMe:
    @pytest.fixture
    def user_token(self, client, clean_db):
        client.post("/api/auth/register", json={
            "name": "Me Tester",
            "email": "me@example.com",
            "password": "password123",
        })
        resp = client.post("/api/auth/login", json={
            "email": "me@example.com", "password": "password123",
        })
        return resp.get_json()["token"]

    def test_valid_token_returns_profile(self, client, user_token):
        resp = client.get("/api/auth/me", headers={
            "Authorization": f"Bearer {user_token}",
        })

        assert resp.status_code == 200
        data = resp.get_json()
        assert data["email"] == "me@example.com"
        assert data["name"] == "Me Tester"

    def test_without_token_returns_401(self, client):
        resp = client.get("/api/auth/me")

        assert resp.status_code == 401


class TestLogout:
    @pytest.fixture
    def user_token(self, client, clean_db):
        client.post("/api/auth/register", json={
            "name": "Logout Tester",
            "email": "logout@example.com",
            "password": "password123",
        })
        resp = client.post("/api/auth/login", json={
            "email": "logout@example.com", "password": "password123",
        })
        return resp.get_json()["token"]

    def test_valid_token_returns_200(self, client, user_token):
        resp = client.post("/api/auth/logout", headers={
            "Authorization": f"Bearer {user_token}",
        })

        assert resp.status_code == 200
        assert resp.get_json()["message"] == "Logged out successfully"

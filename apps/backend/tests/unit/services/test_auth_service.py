"""Unit tests for AuthService."""

import pytest
from werkzeug.security import check_password_hash

from app.extensions import db
from app.models.user import User
from app.services.auth_service import AuthService


@pytest.fixture
def clean_db(app):
    with app.app_context():
        db.create_all()
        User.query.delete()
        db.session.commit()
        yield
        User.query.delete()
        db.session.commit()


class TestRegister:
    def test_valid_registration(self, app, clean_db):
        with app.app_context():
            result = AuthService.register(
                name="Test User",
                email="test@example.com",
                password="password123",
                apartment="101",
                tower="A",
            )

        assert "user" in result
        assert "token" in result
        assert result["user"]["name"] == "Test User"
        assert result["user"]["email"] == "test@example.com"
        assert result["user"]["apartment"] == "101"
        assert result["user"]["tower"] == "A"
        assert result["user"]["role"] == "resident"
        assert "password_hash" not in result["user"]

        with app.app_context():
            user = User.query.filter_by(email="test@example.com").first()
        assert user is not None
        assert check_password_hash(user.password_hash, "password123")

    def test_duplicate_email_raises_error(self, app, clean_db):
        with app.app_context():
            AuthService.register(
                name="First",
                email="test@example.com",
                password="password123",
            )

            with pytest.raises(ValueError, match="Email already registered"):
                AuthService.register(
                    name="Second",
                    email="test@example.com",
                    password="password456",
                )


class TestLogin:
    def test_valid_credentials(self, app, clean_db):
        with app.app_context():
            AuthService.register(
                name="Test User",
                email="test@example.com",
                password="password123",
            )

            result = AuthService.login(email="test@example.com", password="password123")

        assert "user" in result
        assert "token" in result
        assert result["user"]["email"] == "test@example.com"

    def test_invalid_email_raises_error(self, app, clean_db):
        with app.app_context():
            with pytest.raises(ValueError, match="Invalid email or password"):
                AuthService.login(
                    email="nonexistent@example.com", password="password123"
                )

    def test_wrong_password_raises_error(self, app, clean_db):
        with app.app_context():
            AuthService.register(
                name="Test User",
                email="test@example.com",
                password="password123",
            )

            with pytest.raises(ValueError, match="Invalid email or password"):
                AuthService.login(
                    email="test@example.com", password="wrongpassword"
                )


class TestGetProfile:
    def test_existing_user(self, app, clean_db):
        with app.app_context():
            reg = AuthService.register(
                name="Test User",
                email="test@example.com",
                password="password123",
            )
            user_id = reg["user"]["id"]

            profile = AuthService.get_profile(user_id)

        assert profile.id == user_id
        assert profile.name == "Test User"
        assert profile.email == "test@example.com"

    def test_non_existing_user_raises_error(self, app, clean_db):
        with app.app_context():
            with pytest.raises(ValueError, match="User not found"):
                AuthService.get_profile(999)


class TestPasswordHashing:
    def test_werkzeug_hash_check(self):
        from werkzeug.security import generate_password_hash, check_password_hash

        password = "securePass!"
        hashed = generate_password_hash(password)

        assert hashed != password
        assert check_password_hash(hashed, password) is True
        assert check_password_hash(hashed, "wrong") is False


class TestJWT:
    def test_token_contains_user_identity(self, app, clean_db):
        with app.app_context():
            reg = AuthService.register(
                name="Test User",
                email="test@example.com",
                password="password123",
            )
            token = reg["token"]
            user_id = str(reg["user"]["id"])

        from flask_jwt_extended import decode_token

        with app.app_context():
            decoded = decode_token(token)

        assert decoded["sub"] == user_id

    def test_token_is_unique_per_user(self, app, clean_db):
        with app.app_context():
            r1 = AuthService.register(
                name="User One", email="one@example.com", password="password123"
            )
            r2 = AuthService.register(
                name="User Two", email="two@example.com", password="password123"
            )

        assert r1["token"] != r2["token"]

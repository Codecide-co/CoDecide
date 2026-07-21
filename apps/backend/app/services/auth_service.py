"""
Authentication service layer.

Handles user registration, login, profile management, and password changes.
"""

import random
from datetime import datetime, timezone
from typing import Optional

from flask_babel import gettext
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db
from app.models.token_blocklist import TokenBlocklist
from app.models.user import User


class AuthService:
    """Service for authentication and user management operations."""

    @staticmethod
    def register(
        name: str,
        email: str,
        password: str,
        apartment: Optional[str] = None,
        tower: Optional[str] = None,
    ) -> dict:
        """
        Register a new user account.

        Args:
            name: Full name of the user (2-100 characters).
            email: Valid email address, must be unique.
            password: Plain text password (minimum 6 characters).
            apartment: Apartment number (optional).
            tower: Tower letter (optional).

        Returns:
            dict: User profile dictionary with a JWT token.

        Raises:
            ValueError: If the email is already registered.
        """

        existing = User.query.filter_by(email=email).first()
        if existing:
            raise ValueError(gettext("Email already registered"))

        user = User(
            name=name,
            email=email,
            password_hash=generate_password_hash(password),
            apartment=apartment,
            tower=tower,
            role="resident",
            avatar_url=f"/static/avatars/avatar{random.randint(1, 150)}.svg",
        )
        db.session.add(user)
        db.session.commit()

        token = create_access_token(identity=str(user.id))
        return {"user": user.to_dict(), "token": token}

    @staticmethod
    def login(email: str, password: str) -> dict:
        """
        Authenticate a user and return a JWT token.

        Args:
            email: Registered email address.
            password: Plain text password.

        Returns:
            dict: User profile dictionary with a JWT token.

        Raises:
            ValueError: If the email or password is invalid.
        """
        
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            raise ValueError(gettext("Invalid email or password"))

        user.last_seen = datetime.now(timezone.utc)
        db.session.commit()

        token = create_access_token(identity=str(user.id))
        return {"user": user.to_dict(), "token": token}

    @staticmethod
    def get_profile(user_id: int) -> User:
        """
        Retrieve a user's profile by ID.

        Args:
            user_id: The user's unique identifier.

        Returns:
            User: The SQLAlchemy User instance.

        Raises:
            ValueError: If the user is not found.
        """
        user = db.session.get(User, user_id)
        if not user:
            raise ValueError(gettext("User not found"))
        return user


    @staticmethod
    def update_profile(user_id: int, **kwargs) -> User:
        """
        Update a user's profile fields.

        Args:
            user_id: The user's unique identifier.
            **kwargs: Fields to update (name, apartment, tower).

        Returns:
            User: The updated SQLAlchemy User instance.

        Raises:
            ValueError: If the user is not found.
        """

        user = db.session.get(User, user_id)
        if not user:
            raise ValueError(gettext("User not found"))

        for key, value in kwargs.items():
            if value is not None:
                setattr(user, key, value)

        user.updated_at = datetime.now(timezone.utc)
        db.session.commit()
        return user

    @staticmethod
    def change_password(user_id: int, current_password: str, new_password: str) -> None:
        """
        Change a user's password after verifying the current one.

        Args:
            user_id: The user's unique identifier.
            current_password: The user's current password for verification.
            new_password: The new password (minimum 6 characters).

        Raises:
            ValueError: If the user is not found or the current password is incorrect.
        """
        
        user = db.session.get(User, user_id)
        if not user:
            raise ValueError(gettext("User not found"))

        if not check_password_hash(user.password_hash, current_password):
            raise ValueError(gettext("Current password is incorrect"))

        user.password_hash = generate_password_hash(new_password)
        user.updated_at = datetime.now(timezone.utc)
        db.session.commit()

    @staticmethod
    def revoke_token(jti: str, expires_at: datetime) -> None:
        db.session.add(TokenBlocklist(jti=jti, expires_at=expires_at))
        db.session.commit()

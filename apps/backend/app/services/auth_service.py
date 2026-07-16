from datetime import datetime, timezone
from typing import Optional

from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db
from app.models.user import User


class AuthService:

    @staticmethod
    def register(
        name: str,
        email: str,
        password: str,
        apartment: Optional[str] = None,
        tower: Optional[str] = None,
    ) -> dict:
        existing = User.query.filter_by(email=email).first()
        if existing:
            raise ValueError("Email already registered")

        user = User(
            name=name,
            email=email,
            password_hash=generate_password_hash(password),
            apartment=apartment,
            tower=tower,
            role="resident",
        )
        db.session.add(user)
        db.session.commit()

        token = create_access_token(identity=str(user.id))
        return {"user": user.to_dict(), "token": token}

    @staticmethod
    def login(email: str, password: str) -> dict:
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            raise ValueError("Invalid email or password")

        user.last_seen = datetime.now(timezone.utc)
        db.session.commit()

        token = create_access_token(identity=str(user.id))
        return {"user": user.to_dict(), "token": token}

    @staticmethod
    def get_profile(user_id: int) -> User:
        user = db.session.get(User, user_id)
        if not user:
            raise ValueError("User not found")
        return user

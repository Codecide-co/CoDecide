from typing import Optional

from app.extensions import db
from app.models.user import User


class UserService:

    @staticmethod
    def greet(name: str) -> User:
        user: Optional[User] = User.query.filter_by(name=name).first()

        if not user:
            user = User(name=name, email=f"{name.lower()}@example.com")
            db.session.add(user)
            db.session.commit()

        return user

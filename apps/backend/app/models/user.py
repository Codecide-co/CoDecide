from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(100), nullable=False)
    email: str = db.Column(db.String(120), unique=True, nullable=False)

    def to_dict(self) -> dict:
        return {"id": self.id, "name": self.name, "email": self.email}

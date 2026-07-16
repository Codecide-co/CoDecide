from datetime import datetime, timezone

from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class Category(db.Model):
    """
    Represents a report category for classification.

    Categories are classified by type (infrastructure or coexistence)
    and help organize reports for filtering and statistics.
    """

    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(100), nullable=False)
    type: Mapped[str] = mapped_column(
        SAEnum("infrastructure", "coexistence", name="category_type"),
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(db.String(255))
    created_at: Mapped[datetime] = mapped_column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    reports: Mapped[list["Report"]] = relationship(
        "Report", back_populates="category", lazy="selectin"
    )

    def to_dict(self) -> dict:
        """
        Serialize the category to a dictionary.

        Returns:
            dict: Category data including name, type, and description.
        """

        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "description": self.description,
            "created_at": self.created_at.isoformat(),
        }

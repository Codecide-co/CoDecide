from datetime import datetime, timezone

from sqlalchemy import Enum as SAEnum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class Vote(db.Model):
    """
    Represents a user's vote (up or down) on a report.

    Each user can only vote once per report, enforced by a unique constraint.
    Vote types can be changed (upsert) via the vote service.
    """

    __tablename__ = "votes"

    id: Mapped[int] = mapped_column(primary_key=True)
    vote_type: Mapped[str] = mapped_column(
        SAEnum("up", "down", name="vote_type"),
        nullable=False,
    )

    user_id: Mapped[int] = mapped_column(db.ForeignKey("users.id"), nullable=False, index=True)
    report_id: Mapped[int] = mapped_column(db.ForeignKey("reports.id"), nullable=False, index=True)

    created_at: Mapped[datetime] = mapped_column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship("User", back_populates="votes")
    report: Mapped["Report"] = relationship("Report", back_populates="votes")

    __table_args__ = (
        UniqueConstraint("user_id", "report_id", name="uq_user_report_vote"),
    )

    def to_dict(self) -> dict:
        """
        Serialize the vote to a dictionary.

        Returns:
            dict: Vote data including type, user, and report identifiers.
        """
        
        return {
            "id": self.id,
            "vote_type": self.vote_type,
            "user_id": self.user_id,
            "report_id": self.report_id,
            "created_at": self.created_at.isoformat(),
        }

from datetime import datetime, timezone

from sqlalchemy.orm import Mapped, mapped_column

from app.extensions import db


class AttachmentEntry(db.Model):
    """
    Represents an uploaded file attached to a report.

    Stores metadata about files uploaded as evidence. Can be stored in
    SQL or MongoDB depending on the USE_MONGO configuration flag.
    """

    __tablename__ = "attachments"

    id: Mapped[int] = mapped_column(primary_key=True)
    report_id: Mapped[int] = mapped_column(db.ForeignKey("reports.id"), nullable=False)
    file_name: Mapped[str] = mapped_column(db.String(255), nullable=False)
    file_url: Mapped[str] = mapped_column(db.String(512), nullable=False)
    file_type: Mapped[str] = mapped_column(db.String(50), nullable=False)
    file_size: Mapped[int] = mapped_column(db.Integer, nullable=False)
    uploaded_by: Mapped[int] = mapped_column(db.ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self) -> dict:
        """
        Serialize the attachment entry to a dictionary.

        Returns:
            dict: Attachment metadata including file info and timestamps.
        """

        return {
            "id": self.id,
            "report_id": self.report_id,
            "file_name": self.file_name,
            "file_url": self.file_url,
            "file_type": self.file_type,
            "file_size": self.file_size,
            "uploaded_by": self.uploaded_by,
            "created_at": self.created_at.isoformat(),
        }

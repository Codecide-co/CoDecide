"""
Attachment routes.

Provides endpoints for retrieving file attachment metadata.
"""

from flask import Blueprint, jsonify

from app.middleware.auth import login_required
from app.mongo.attachment import Attachment

attachments_bp = Blueprint("attachments", __name__, url_prefix="/api/attachments")


@attachments_bp.route("/<attachment_id>", methods=["GET"])
@login_required
def get_attachment(attachment_id: str):
    """
    Get metadata for a specific attachment by its MongoDB ID.

    Args:
        attachment_id: The attachment's MongoDB ObjectId as a string.

    Returns:
        tuple: JSON response with attachment metadata, HTTP 200.
    """

    attachment = Attachment.find_by_id(attachment_id)
    if not attachment:
        return jsonify({"error": "Attachment not found"}), 404
    return jsonify(Attachment.to_dict(attachment)), 200

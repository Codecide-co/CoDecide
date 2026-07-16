"""
Attachment routes.

Provides endpoints for uploading files, retrieving attachment metadata,
and serving uploaded files.
"""

import os

from flask import Blueprint, current_app, jsonify, request, send_from_directory

from app.middleware.auth import login_required
from app.mongo.attachment import Attachment
from app.services.attachment_service import AttachmentService

attachments_bp = Blueprint("attachments", __name__, url_prefix="/api/attachments")


@attachments_bp.route("/upload", methods=["POST"])
@login_required
def upload_attachment():
    """
    Upload a file as an attachment to a report.

    Accepts multipart/form-data with a file and a report_id.
    Delegates validation and storage to AttachmentService.

    Request:
        file (file): The file to upload.
        report_id (int): ID of the associated report.

    Returns:
        tuple: JSON response with attachment metadata, HTTP 201.
    """

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    report_id = request.form.get("report_id", type=int)

    if not report_id:
        return jsonify({"error": "report_id is required"}), 400

    try:
        result = AttachmentService.upload(
            file=file,
            report_id=report_id,
            uploaded_by=request.current_user.id,
        )
        return jsonify(result), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


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


@attachments_bp.route("/<attachment_id>/file", methods=["GET"])
@login_required
def serve_attachment_file(attachment_id: str):
    """
    Serve the actual file of an attachment.

    Looks up the attachment metadata in MongoDB and returns the file
    from the uploads directory.

    Args:
        attachment_id: The attachment's MongoDB ObjectId as a string.

    Returns:
        Response: The file contents with the correct MIME type, HTTP 200.
    """

    attachment = Attachment.find_by_id(attachment_id)
    if not attachment:
        return jsonify({"error": "Attachment not found"}), 404

    file_url = attachment.get("file_url", "")
    filename = file_url.rsplit("/", 1)[-1] if "/" in file_url else file_url

    if ".." in filename or "/" in filename or os.path.isabs(filename):
        return jsonify({"error": "Invalid file path"}), 400

    upload_folder = current_app.config["UPLOAD_FOLDER"]

    return send_from_directory(upload_folder, filename)

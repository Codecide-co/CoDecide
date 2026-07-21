"""
Comunicado (announcement) routes.

Handles listing and creating official community announcements.
"""

from flask import Blueprint, jsonify, request
from flask_babel import gettext

from app.extensions import db
from app.middleware.auth import admin_required
from app.models.comunicado import Comunicado

comunicados_bp = Blueprint("comunicados", __name__, url_prefix="/api/comunicados")


@comunicados_bp.route("", methods=["GET"])
def list_comunicados():
    """
    List all official announcements, newest first.

    Returns:
        tuple: JSON array of comunicados, HTTP 200.
    """

    comunicados = (
        Comunicado.query.order_by(Comunicado.created_at.desc()).all()
    )
    return jsonify([c.to_dict() for c in comunicados]), 200


@comunicados_bp.route("", methods=["POST"])
@admin_required
def create_comunicado():
    """
    Create a new official announcement (admin only).

    Request body must include title and body fields.

    Returns:
        tuple: JSON response with the created comunicado, HTTP 201.
    """
    
    data = request.get_json()
    if not data or not data.get("title") or not data.get("body"):
        return jsonify({"error": gettext("title and body are required")}), 400

    comunicado = Comunicado(
        title=data["title"],
        body=data["body"],
        author_id=request.current_user.id,
    )
    db.session.add(comunicado)
    db.session.commit()

    return jsonify(comunicado.to_dict()), 201

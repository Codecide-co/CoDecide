"""
Category routes.

Handles listing and creating report categories.
"""

from flask import Blueprint, jsonify, request
from marshmallow import Schema, fields, validate

from app.extensions import db
from app.middleware.auth import admin_required
from app.models.category import Category

categories_bp = Blueprint("categories", __name__, url_prefix="/api/categories")


class CreateCategorySchema(Schema):
    """Marshmallow schema for validating category creation requests."""

    name = fields.String(required=True, validate=validate.Length(min=2, max=100))
    type = fields.String(
        required=True,
        validate=validate.OneOf(["infrastructure", "coexistence"]),
    )
    description = fields.String(validate=validate.Length(max=255))


@categories_bp.route("", methods=["GET"])
def list_categories():
    """
    List all categories sorted by name.

    Returns:
        tuple: JSON array of categories, HTTP 200.
    """

    categories = Category.query.order_by(Category.name).all()
    return jsonify([c.to_dict() for c in categories]), 200


@categories_bp.route("", methods=["POST"])
@admin_required
def create_category():
    """
    Create a new category (admin only).

    Validates the request body against CreateCategorySchema and ensures
    the category name is unique.

    Returns:
        tuple: JSON response with the created category, HTTP 201.
    """
    
    schema = CreateCategorySchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    data = schema.load(request.json)
    existing = Category.query.filter_by(name=data["name"]).first()
    if existing:
        return jsonify({"error": "Category already exists"}), 409

    category = Category(name=data["name"], type=data["type"], description=data.get("description"))
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201

from flask import Blueprint, jsonify, request

from app.middleware.auth import login_required
from app.schemas.auth_schema import AuthResponseSchema, LoginSchema, RegisterSchema
from app.services.auth_service import AuthService

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    schema = RegisterSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    try:
        result = AuthService.register(**schema.load(request.json))
        response = result["user"]
        response["token"] = result["token"]
        return jsonify(response), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 409


@auth_bp.route("/login", methods=["POST"])
def login():
    schema = LoginSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    try:
        result = AuthService.login(**schema.load(request.json))
        response = result["user"]
        response["token"] = result["token"]
        return jsonify(response), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 401


@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    user = request.current_user
    return jsonify(user.to_dict()), 200


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    return jsonify({"message": "Logged out successfully"}), 200

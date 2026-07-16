from flask import Blueprint, jsonify, request

from app.middleware.auth import login_required
from app.schemas.auth_schema import (
    AuthResponseSchema,
    ChangePasswordSchema,
    LoginSchema,
    RegisterSchema,
    UpdateProfileSchema,
)
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


@auth_bp.route("/me", methods=["PATCH"])
@login_required
def update_profile():
    schema = UpdateProfileSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    try:
        data = schema.load(request.json)
        user = AuthService.update_profile(request.current_user.id, **data)
        return jsonify(user.to_dict()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@auth_bp.route("/change-password", methods=["POST"])
@login_required
def change_password():
    schema = ChangePasswordSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    try:
        data = schema.load(request.json)
        AuthService.change_password(
            request.current_user.id,
            current_password=data["current_password"],
            new_password=data["new_password"],
        )
        return jsonify({"message": "Password updated successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    return jsonify({"message": "Logged out successfully"}), 200

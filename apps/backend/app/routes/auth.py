"""
Authentication routes.

Handles user registration, login, profile management, password changes, and logout.
"""

from datetime import datetime, timezone

from flask import Blueprint, jsonify, request
from flask_babel import gettext
from flask_jwt_extended import get_jwt

from app.middleware.auth import login_required
from app.schemas.auth_schema import (
    ChangePasswordSchema,
    LoginSchema,
    RegisterSchema,
    UpdateProfileSchema,
)
from app.services.auth_service import AuthService
from app.services.avatar_service import AvatarService

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register a new user account.

    Request body is validated against RegisterSchema. On success, returns
    the user profile and a JWT token.

    Returns:
        tuple: JSON response with user data and token, HTTP 201.
    """

    schema = RegisterSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify({"error": gettext("Validation failed"), "details": errors}), 400

    try:
        result = AuthService.register(**schema.load(request.json))
        response = result["user"]
        response["token"] = result["token"]
        return jsonify(response), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 409


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticate a user and return a JWT token.

    Validates credentials against LoginSchema. Updates the user's last_seen
    timestamp on successful login.

    Returns:
        tuple: JSON response with user data and token, HTTP 200.
    """

    schema = LoginSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify({"error": gettext("Validation failed"), "details": errors}), 400

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
    """
    Get the authenticated user's profile.

    Returns:
        tuple: JSON response with user data, HTTP 200.
    """

    user = request.current_user
    return jsonify(user.to_dict()), 200


@auth_bp.route("/me", methods=["PATCH"])
@login_required
def update_profile():
    """
    Update the authenticated user's profile fields.

    Accepts partial updates for name, apartment, and tower.

    Returns:
        tuple: JSON response with updated user data, HTTP 200.
    """

    schema = UpdateProfileSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify({"error": gettext("Validation failed"), "details": errors}), 400

    try:
        data = schema.load(request.json)
        user = AuthService.update_profile(request.current_user.id, **data)
        return jsonify(user.to_dict()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@auth_bp.route("/change-password", methods=["POST"])
@login_required
def change_password():
    """
    Change the authenticated user's password.

    Requires the current password for verification.

    Returns:
        tuple: JSON success message, HTTP 200.
    """

    schema = ChangePasswordSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify({"error": gettext("Validation failed"), "details": errors}), 400

    try:
        data = schema.load(request.json)
        AuthService.change_password(
            request.current_user.id,
            current_password=data["current_password"],
            new_password=data["new_password"],
        )
        return jsonify({"message": gettext("Password updated successfully")}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@auth_bp.route("/me/avatar", methods=["POST"])
@login_required
def upload_avatar():
    """
    Upload a custom avatar image.

    Accepts a multipart file upload. Validates the file is an allowed image
    type (PNG, JPG, JPEG, SVG, GIF), saves it to the uploads folder, and
    updates the user's avatar_url.

    Returns:
        tuple: JSON with updated user data, HTTP 200.
    """

    if "file" not in request.files:
        return jsonify({"error": gettext("No file provided")}), 400

    try:
        user = AvatarService.upload_avatar(
            file=request.files["file"],
            user_id=request.current_user.id,
        )
        return jsonify(user.to_dict()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    """
    Log out the authenticated user.

    Revokes the current JWT by adding its JTI to the blocklist.
    The token is then rejected on subsequent requests.

    Returns:
        tuple: JSON success message, HTTP 200.
    """

    jti = get_jwt()["jti"]
    expires_at = datetime.fromtimestamp(get_jwt()["exp"], tz=timezone.utc)
    AuthService.revoke_token(jti, expires_at)

    return jsonify({"message": gettext("Logged out successfully")}), 200

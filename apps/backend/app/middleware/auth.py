"""
Authentication and authorization middleware.

Provides decorators for JWT-based login verification and admin role checking.
"""

from functools import wraps
from typing import Callable

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from app.extensions import db
from app.models.user import User


def login_required(fn: Callable) -> Callable:
    """
    Decorator that requires a valid JWT token for the endpoint.

    Resolves the user from the token identity and attaches it to
    ``request.current_user``.

    Args:
        fn: The view function to wrap.

    Returns:
        Callable: The wrapped function with authentication check.
    """
    
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        if not user:
            return jsonify({"error": "User not found"}), 401
        request.current_user = user
        return fn(*args, **kwargs)
    return wrapper


def admin_required(fn: Callable) -> Callable:
    """
    Decorator that requires both a valid JWT token and admin role.

    Extends ``login_required`` by additionally checking that the user's
    role is ``admin``.

    Args:
        fn: The view function to wrap.

    Returns:
        Callable: The wrapped function with authentication and authorization checks.
    """

    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        if not user:
            return jsonify({"error": "User not found"}), 401
        if user.role != "admin":
            return jsonify({"error": "Admin access required"}), 403
        request.current_user = user
        return fn(*args, **kwargs)
    return wrapper

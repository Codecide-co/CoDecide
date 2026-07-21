"""
Test routes to verify that the API is working.
"""

from flask import Blueprint, jsonify

hello_bp = Blueprint("hello", __name__)


@hello_bp.route("/hello", methods=["GET"])
def hello() -> tuple:
    """
    Test endpoint.

    Returns:
        tuple: Welcome message and HTTP 200 code.
    """
    
    return jsonify({"message": "Hello, CoDecide!"}), 200
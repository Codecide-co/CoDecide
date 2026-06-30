from flask import Blueprint, jsonify

from app.services.user_service import UserService

hello_bp = Blueprint("hello", __name__)


@hello_bp.route("/hello")
def hello() -> tuple:
    return jsonify({"message": "Hello, CokeDecide!"}), 200


@hello_bp.route("/hello/<name>")
def hello_with_name(name: str) -> tuple:
    user = UserService.greet(name)
    return jsonify(user.to_dict()), 200

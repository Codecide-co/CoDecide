"""
Rutas de prueba para verificar que la API está funcionando.
"""

from flask import Blueprint, jsonify

hello_bp = Blueprint("hello", __name__)


@hello_bp.route("/hello", methods=["GET"])
def hello() -> tuple:
    """
    Endpoint de prueba.

    Returns:
        tuple: Mensaje de bienvenida y código HTTP 200.
    """
    return jsonify({"message": "Hello, CokeDecide!"}), 200
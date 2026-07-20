"""
Flask application factory.

Initializes the Flask app with extensions (SQLAlchemy, MongoDB, JWT, Migrate)
and registers all route blueprints.
"""

import os

from flask import Flask
from flask_cors import CORS
from flask import send_from_directory

from app.config import Config
from app.extensions import db, jwt, migrate, mongo
from app.routes import register_blueprints
from app.models.token_blocklist import TokenBlocklist


def create_app() -> Flask:
    """
    Create and configure the Flask application.

    Configures CORS from comma-separated origins, initializes database
    and authentication extensions, and registers all blueprints.

    Returns:
        Flask: The fully configured Flask application instance.
    """
    
    app = Flask(__name__)
    app.config.from_object(Config)

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    origins = [
        origin.strip()
        for origin in Config.CORS_ORIGINS.split(",")
    ]
    CORS(app, origins=origins, supports_credentials=True)

    db.init_app(app)
    if Config.USE_MONGO:
        mongo.init_app(app, uri=Config.MONGO_URI)
    migrate.init_app(app, db)
    jwt.init_app(app)

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        return TokenBlocklist.query.filter_by(jti=jwt_payload["jti"]).first() is not None

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return {"error": "Token has been revoked"}, 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {"error": "Token has expired"}, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {"error": "Invalid token"}, 401

    register_blueprints(app)

    @app.route("/uploads/<path:filename>")
    def serve_upload(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    return app

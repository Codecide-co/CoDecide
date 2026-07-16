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
    mongo.init_app(app, uri=Config.MONGO_URI)
    migrate.init_app(app, db)
    jwt.init_app(app)

    register_blueprints(app)

    @app.route("/uploads/<path:filename>")
    def serve_upload(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    return app

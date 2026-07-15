from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.extensions import db, jwt, migrate, mongo
from app.routes import register_blueprints


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

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

    return app

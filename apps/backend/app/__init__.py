from flask import Flask

from app.config import Config
from app.extensions import db, mongo
from app.routes import register_blueprints


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    mongo.init_app(app, uri=Config.MONGO_URI)

    register_blueprints(app)

    with app.app_context():
        from app.models import user  # noqa: F401

        db.create_all()

    return app

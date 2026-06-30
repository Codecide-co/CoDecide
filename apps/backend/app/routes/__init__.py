from flask import Flask


def register_blueprints(app: Flask) -> None:
    from app.routes.hello import hello_bp

    app.register_blueprint(hello_bp, url_prefix="/api")

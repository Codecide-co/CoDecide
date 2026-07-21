"""
Route blueprint registration.

Imports and registers all route blueprints with the Flask application.
"""

from flask import Flask


def register_blueprints(app: Flask) -> None:
    """
    Register all API route blueprints with the Flask app.

    Each blueprint is imported lazily to avoid circular imports and
    registered with its appropriate URL prefix.

    Args:
        app: The Flask application instance.
    """
    
    from app.routes.admin import admin_bp
    from app.routes.attachments import attachments_bp
    from app.routes.auth import auth_bp
    from app.routes.categories import categories_bp
    from app.routes.comunicados import comunicados_bp
    from app.routes.hello import hello_bp
    from app.routes.reports import reports_bp
    from app.routes.stats import stats_bp

    app.register_blueprint(hello_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(categories_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(comunicados_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(attachments_bp)

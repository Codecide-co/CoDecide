from flask import Flask


def register_blueprints(app: Flask) -> None:
    from app.routes.admin import admin_bp
    from app.routes.auth import auth_bp
    from app.routes.comunicados import comunicados_bp
    from app.routes.hello import hello_bp
    from app.routes.reports import reports_bp
    from app.routes.stats import stats_bp

    app.register_blueprint(hello_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(reports_bp)
    app.register_blueprint(comunicados_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(admin_bp)

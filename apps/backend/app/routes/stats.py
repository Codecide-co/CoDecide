from flask import Blueprint, jsonify, request

from app.middleware.auth import login_required
from app.services.stats_service import StatsService

stats_bp = Blueprint("stats", __name__, url_prefix="/api/stats")


@stats_bp.route("", methods=["GET"])
@login_required
def get_stats():
    stats = StatsService.get_community_stats()
    return jsonify(stats), 200


@stats_bp.route("/reports-over-time", methods=["GET"])
@login_required
def reports_over_time():
    days = request.args.get("days", 30, type=int)
    data = StatsService.get_reports_over_time(days=days)
    return jsonify(data), 200

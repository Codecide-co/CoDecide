from flask import Blueprint, jsonify

from app.middleware.auth import login_required
from app.services.stats_service import StatsService

stats_bp = Blueprint("stats", __name__, url_prefix="/api/stats")


@stats_bp.route("", methods=["GET"])
@login_required
def get_stats():
    stats = StatsService.get_community_stats()
    return jsonify(stats), 200

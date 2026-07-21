import { t } from "@core/i18n";

export function StatCards({ stats, containerId = "stats-cards" }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="stat-card"><span class="stat-card-label">${t("stats.cards.total")}</span><span class="stat-card-value">${stats.total_reports}</span></div>
    <div class="stat-card"><span class="stat-card-label">${t("stats.cards.open")}</span><span class="stat-card-value">${stats.by_status.open}</span></div>
    <div class="stat-card"><span class="stat-card-label">${t("stats.cards.in_progress")}</span><span class="stat-card-value">${stats.by_status.in_progress}</span></div>
    <div class="stat-card"><span class="stat-card-label">${t("stats.cards.resolved")}</span><span class="stat-card-value">${stats.by_status.resolved}</span></div>
    <div class="stat-card"><span class="stat-card-label">${t("stats.cards.closed")}</span><span class="stat-card-value">${stats.by_status.closed}</span></div>
    <div class="stat-card"><span class="stat-card-label">${t("stats.cards.total_users")}</span><span class="stat-card-value">${stats.total_users}</span></div>
    <div class="stat-card"><span class="stat-card-label">${t("stats.cards.total_votes")}</span><span class="stat-card-value">${stats.total_votes}</span></div>
    <div class="stat-card"><span class="stat-card-label">${t("stats.cards.avg_resolution")}</span><span class="stat-card-value">${stats.avg_resolution_time != null ? stats.avg_resolution_time + "h" : "N/A"}</span></div>
  `;
}

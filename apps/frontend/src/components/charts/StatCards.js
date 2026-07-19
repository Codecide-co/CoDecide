export function StatCards({ stats, containerId = "stats-cards" }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="stat-card"><span class="stat-card-label">Total Reports</span><span class="stat-card-value">${stats.total_reports}</span></div>
    <div class="stat-card"><span class="stat-card-label">Open</span><span class="stat-card-value">${stats.by_status.open}</span></div>
    <div class="stat-card"><span class="stat-card-label">In Progress</span><span class="stat-card-value">${stats.by_status.in_progress}</span></div>
    <div class="stat-card"><span class="stat-card-label">Resolved</span><span class="stat-card-value">${stats.by_status.resolved}</span></div>
    <div class="stat-card"><span class="stat-card-label">Closed</span><span class="stat-card-value">${stats.by_status.closed}</span></div>
    <div class="stat-card"><span class="stat-card-label">Total Users</span><span class="stat-card-value">${stats.total_users}</span></div>
    <div class="stat-card"><span class="stat-card-label">Total Votes</span><span class="stat-card-value">${stats.total_votes}</span></div>
    <div class="stat-card"><span class="stat-card-label">Avg Resolution</span><span class="stat-card-value">${stats.avg_resolution_time != null ? stats.avg_resolution_time + "h" : "N/A"}</span></div>
  `;
}

export function StatCard({ label, value, color = "#2563EB" }) {
  return `
    <div class="admin-stat-card">
      <div class="admin-stat-value" style="color: ${color}">${value}</div>
      <div class="admin-stat-label">${label}</div>
    </div>
  `;
}
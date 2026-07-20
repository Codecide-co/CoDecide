import { escapeHtml } from "@core/helpers";

export function ResolutionTable({ data, catMap, containerId = "stats-resolution-table" }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!data || Object.keys(data).length === 0) {
    container.innerHTML = `<p class="stats-empty">No resolution data available.</p>`;
    return;
  }

  const rows = Object.entries(data)
    .filter(([, v]) => v.avg_hours != null)
    .sort((a, b) => b[1].avg_hours - a[1].avg_hours);

  if (rows.length === 0) {
    container.innerHTML = `<p class="stats-empty">No reports have been resolved yet.</p>`;
    return;
  }

  container.innerHTML = `
    <table class="stats-table">
      <colgroup>
        <col style="width:75%">
        <col style="width:25%">
      </colgroup>
      <thead>
        <tr><th>Category</th><th>Avg Time (hours)</th></tr>
      </thead>
      <tbody>
        ${rows.map(([catId, v]) => `
          <tr>
            <td>${escapeHtml(catMap[catId] || `Category ${catId}`)}</td>
            <td>${v.avg_hours.toFixed(1)}h</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

export function TopVotedTable({ reports, containerId = "stats-top-voted" }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!reports || reports.length === 0) {
    container.innerHTML = `<p class="stats-empty">No votes yet.</p>`;
    return;
  }

  container.innerHTML = `
    <table class="stats-table">
      <colgroup>
        <col style="width:8%">
        <col style="width:56%">
        <col style="width:12%">
        <col style="width:12%">
        <col style="width:12%">
      </colgroup>
      <thead>
        <tr><th>#</th><th>Title</th><th>Up</th><th>Down</th><th>Total</th></tr>
      </thead>
      <tbody>
        ${reports.map((r, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${escapeHtml(r.title)}</td>
            <td class="stats-vote-up">${r.upvotes}</td>
            <td class="stats-vote-down">${r.downvotes}</td>
            <td><strong>${r.total_votes}</strong></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

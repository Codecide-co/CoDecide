export function DataTable({ reports, categories }) {
  if (!reports || reports.length === 0) {
    return `<p style="text-align: center; color: #94A3B8; padding: 2rem;">No reports found.</p>`;
  }

  return `
    <div style="overflow-x: auto;">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Category</th>
            <th>Date</th>
            <th>Reporter</th>
            <th>Votes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${reports
            .map(
              (r) => `
            <tr>
              <td><strong>${r.title}</strong></td>
              <td><span class="admin-status-badge ${r.status}">${r.status.replace("_", " ")}</span></td>
              <td>${r.category_name || "—"}</td>
              <td>${new Date(r.created_at).toLocaleDateString()}</td>
              <td>${r.author_name || "—"}</td>
              <td>${r.votes_count || 0}</td>
              <td>
                <select class="admin-status-select" data-report-id="${r.id}" data-current-status="${r.status}">
                  <option value="open" ${r.status === "open" ? "selected" : ""}>Open</option>
                  <option value="in_progress" ${r.status === "in_progress" ? "selected" : ""}>In Progress</option>
                  <option value="resolved" ${r.status === "resolved" ? "selected" : ""}>Resolved</option>
                  <option value="closed" ${r.status === "closed" ? "selected" : ""}>Closed</option>
                </select>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

export function initDataTable({ onStatusChange }) {
  document.querySelectorAll(".admin-status-select").forEach((select) => {
    select.addEventListener("change", (e) => {
      const reportId = parseInt(e.target.dataset.reportId);
      const newStatus = e.target.value;
      const currentStatus = e.target.dataset.currentStatus;
      if (newStatus !== currentStatus) {
        onStatusChange(reportId, newStatus, e.target);
      }
    });
  });
}
const validTransitions = {
  open: ["in_progress"],
  in_progress: ["resolved"],
  resolved: [],
};

export function DataTable({ reports, categories, onViewHistory }) {
  if (!reports || reports.length === 0) {
    return `<p class="text-center p-8">No reports found.</p>`;
  }

  return `
    <div class="overflow-x-auto">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Category</th>
            <th>Date</th>
            <th>Reporter</th>
            <th>Votes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${reports
            .map(
              (r) => {
                const transitions = validTransitions[r.status] || [];
                const hasTransitions = transitions.length > 0;
                return `
            <tr>
              <td><strong>${r.title}</strong></td>
              <td><span class="admin-status-badge ${r.status}">${r.status.replace("_", " ")}</span></td>
              <td>${r.category_name || "—"}</td>
              <td>${new Date(r.created_at).toLocaleDateString()}</td>
              <td>${r.author_name || "—"}</td>
              <td>${r.votes_count || 0}</td>
              <td>
                <div class="flex items-center gap-2">
                  ${hasTransitions ? `
                  <select class="admin-status-select" data-report-id="${r.id}" data-current-status="${r.status}">
                    <option value="${r.status}" disabled selected>${r.status.replace("_", " ")}</option>
                    ${transitions.map(t => `<option value="${t}">${t.replace("_", " ")}</option>`).join("")}
                  </select>` : ""}
                  <button class="history-btn" data-report-id="${r.id}">History</button>
                </div>
              </td>
            </tr>`;
              }
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

export function initDataTable({ onStatusChange, onViewHistory }) {
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

  document.querySelectorAll(".history-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const reportId = parseInt(e.target.dataset.reportId);
      if (onViewHistory) onViewHistory(reportId);
    });
  });
}
import { formatDate } from "@core/helpers";
import { t } from "@core/i18n";

export function DataTable({ reports, categories, validTransitions, onViewHistory }) {
  if (!reports || reports.length === 0) {
    return `<p class="text-center p-8">${t("admin.table.empty")}</p>`;
  }

  return `
    <div class="overflow-x-auto">
      <table class="admin-table">
        <thead>
          <tr>
            <th>${t("admin.table.title")}</th>
            <th>${t("admin.table.status")}</th>
            <th>${t("admin.table.category")}</th>
            <th>${t("admin.table.date")}</th>
            <th>${t("admin.table.reporter")}</th>
            <th>${t("admin.table.votes")}</th>
            <th>${t("admin.table.actions")}</th>
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
              <td>${formatDate(r.created_at)}</td>
              <td>${r.author_name || "—"}</td>
              <td>${r.votes_count || 0}</td>
              <td>
                <div class="flex items-center gap-2">
                  ${hasTransitions ? `
                  <select class="admin-status-select" data-report-id="${r.id}" data-current-status="${r.status}">
                    <option value="${r.status}" disabled selected>${r.status.replace("_", " ")}</option>
                    ${transitions.map(t => `<option value="${t}">${t.replace("_", " ")}</option>`).join("")}
                  </select>` : ""}
                  <button class="history-btn" data-report-id="${r.id}">${t("admin.table.history")}</button>
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

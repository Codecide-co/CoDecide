import { navigateTo } from "@core/helpers";
import { t } from "@core/i18n";

export function ProfileReports({ reports, loading, error }) {
  const wrapperId = "profile-reports-wrapper";

  setTimeout(() => {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    if (loading) return;
    if (error) {
      wrapper.innerHTML = `<p class="profile-error">${t("profile.reports_error")}</p>`;
      return;
    }
    if (!reports || reports.length === 0) {
      wrapper.innerHTML = `<p class="profile-empty">${t("profile.reports_empty")}</p>`;
      return;
    }
    wrapper.innerHTML = `<div class="profile-reports-grid">${
      reports.map((r) => `
        <div class="profile-report-card" data-id="${r.id}" role="button" tabindex="0">
          <div class="profile-report-title">${r.title}</div>
          <div class="profile-report-id">#${r.tracking_number || r.id}</div>
          <span class="home-status-badge ${r.status}">${r.status.replace("_", " ")}</span>
        </div>
      `).join("")
    }</div>`;

    wrapper.querySelectorAll(".profile-report-card").forEach((card) => {
      const id = card.dataset.id;
      card.addEventListener("click", () => navigateTo(`/reports/${id}`));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") navigateTo(`/reports/${id}`);
      });
    });
  }, 0);

  return `
    <div class="profile-section-reports">
      <h3 class="profile-section-title">${t("profile.my_reports")}</h3>
        <div id="${wrapperId}" class="profile-reports-scroll">
            <div class="profile-reports-grid">
                <p class="profile-loading">${t("profile.reports_loading")}</p>
            </div>
        </div>
    </div>
  `;
}

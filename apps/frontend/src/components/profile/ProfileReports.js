import { navigateTo } from "@core/helpers";

export function ProfileReports({ reports, loading, error }) {
  const wrapperId = "profile-reports-wrapper";

  setTimeout(() => {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    if (loading) return;
    if (error) {
      wrapper.innerHTML = '<p class="profile-error">Could not load reports.</p>';
      return;
    }
    if (!reports || reports.length === 0) {
      wrapper.innerHTML = '<p class="profile-empty">No reports yet.</p>';
      return;
    }
    wrapper.innerHTML = reports.map((r) => `
      <div class="profile-report-card" data-id="${r.id}" role="button" tabindex="0">
        <div class="profile-report-title">${r.title}</div>
        <div class="profile-report-id">#${r.tracking_number || r.id}</div>
        <span class="home-status-badge ${r.status}">${r.status.replace("_", " ")}</span>
      </div>
    `).join("");

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
      <h3 class="profile-section-title">My Reports</h3>
        <div id="${wrapperId}" class="profile-reports-scroll">
            <div class="profile-reports-grid">
                <p class="profile-loading">Loading reports...</p>
            </div>
        </div>
    </div>
  `;
}

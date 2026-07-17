import { fetchApiData } from "@utils/api";

export function ProfileReports(userId) {
  const wrapperId = "profile-reports-wrapper";

  setTimeout(() => {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper || !userId) return;

    fetchApiData(`/reports?user_id=${userId}&per_page=6`)
      .then((data) => {
        const reports = data.reports || [];
        if (reports.length === 0) {
          wrapper.innerHTML = '<p class="profile-empty">No reports yet.</p>';
          return;
        }
        wrapper.innerHTML = reports.map((r) => `
          <div class="profile-report-card">
            <div class="profile-report-title">${r.title}</div>
            <div class="profile-report-id">#${r.tracking_number || r.id}</div>
            <span class="home-status-badge ${r.status}">${r.status.replace("_", " ")}</span>
          </div>
        `).join("");
      })
      .catch(() => {
        wrapper.innerHTML = '<p class="profile-error">Could not load reports.</p>';
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
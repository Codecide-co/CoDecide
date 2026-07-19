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
      <div class="profile-report-card">
        <div class="profile-report-title">${r.title}</div>
        <div class="profile-report-id">#${r.tracking_number || r.id}</div>
        <span class="home-status-badge ${r.status}">${r.status.replace("_", " ")}</span>
      </div>
    `).join("");
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

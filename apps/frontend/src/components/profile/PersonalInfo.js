export function PersonalInfo(user) {
  if (!user) return "";

  return `
    <div class="profile-info-section">
      <div class="profile-info-header">
        <h3>Personal Information</h3>
        <button class="profile-edit-btn" id="btn-edit-profile"><img src="../../public/pincel.svg"> Edit</button>
      </div>
      <div class="profile-info-grid">
        <div class="profile-info-item">
          <span class="profile-info-label">Apartment</span>
          <span class="profile-info-value">${user.apartment || "—"}</span>
        </div>
        <div class="profile-info-item">
          <span class="profile-info-label">Tower</span>
          <span class="profile-info-value">${user.tower || "—"}</span>
        </div>
        <div class="profile-info-item">
          <span class="profile-info-label">Role</span>
          <span class="profile-info-value capitalize">${user.role || "—"}</span>
        </div>
        <div class="profile-info-item">
          <span class="profile-info-label">Member since</span>
          <span class="profile-info-value">${user.created_at ? new Date(user.created_at).toLocaleDateString("en-GB") : "—"}</span>
        </div>
      </div>
    </div>
  `;
}
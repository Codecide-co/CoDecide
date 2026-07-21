import { formatDate } from "@core/helpers";
import { t } from "@core/i18n";

export function PersonalInfo(user) {
  if (!user) return "";

  return `
    <div class="profile-info-section">
      <div class="profile-info-header">
        <h3>${t("profile.personal_info")}</h3>
        <button class="profile-edit-btn" id="btn-edit-profile"><img src="/pincel.svg"> ${t("profile.edit_btn")}</button>
      </div>
      <div class="profile-info-grid">
        <div class="profile-info-item">
          <span class="profile-info-label">${t("profile.apartment")}</span>
          <span class="profile-info-value">${user.apartment || "—"}</span>
        </div>
        <div class="profile-info-item">
          <span class="profile-info-label">${t("profile.tower")}</span>
          <span class="profile-info-value">${user.tower || "—"}</span>
        </div>
        <div class="profile-info-item">
          <span class="profile-info-label">${t("profile.role")}</span>
          <span class="profile-info-value capitalize">${user.role || "—"}</span>
        </div>
        <div class="profile-info-item">
          <span class="profile-info-label">${t("profile.member_since")}</span>
          <span class="profile-info-value">${formatDate(user.created_at)}</span>
        </div>
      </div>
    </div>
  `;
}
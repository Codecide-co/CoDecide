import { t } from "@core/i18n";

export function SecuritySection() {
  return `
    <div class="profile-section-security">
      <h3 class="profile-section-title">${t("profile.security")}</h3>
      <button class="profile-security-btn" id="btn-change-password">
        <img src="/security.svg"> ${t("profile.change_password")}
      </button>
    </div>
  `;
}
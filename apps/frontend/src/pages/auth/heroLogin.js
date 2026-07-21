import { t } from "@core/i18n";

export function viewHeroLogin() {
  return `
  <section class="auth-hero-section hidden md:flex flex-col">
    <div class="auth-hero-info">
      <span class="auth-hero-tag">${t("auth.hero.tagline")}</span>
      <h2 class="auth-hero-info-title">${t("auth.hero.title")}</h2>
      <p class="auth-hero-info-desc">${t("auth.hero.desc")}</p>
    </div>
    <div class="auth-hero-features">
      <div class="auth-hero-feature">
        <div>
          <h3 class="auth-hero-feature-title">${t("auth.hero.feature1_title")}</h3>
          <p class="auth-hero-feature-desc">${t("auth.hero.feature1_desc")}</p>
        </div>
      </div>
      <div class="auth-hero-feature">
        <div>
          <h3 class="auth-hero-feature-title">${t("auth.hero.feature2_title")}</h3>
          <p class="auth-hero-feature-desc">${t("auth.hero.feature2_desc")}</p>
        </div>
      </div>
      <div class="auth-hero-feature">
        <div>
          <h3 class="auth-hero-feature-title">${t("auth.hero.feature3_title")}</h3>
          <p class="auth-hero-feature-desc">${t("auth.hero.feature3_desc")}</p>
        </div>
      </div>
    </div>
  </section>
`;
}
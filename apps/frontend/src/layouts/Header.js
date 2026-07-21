import { isAuthenticated } from "@core/helpers";
import { authStore } from "@store/auth.store";
import { UPLOADS_BASE } from "@core/api";
import { t, langToggleHtml } from "@core/i18n";

export function HeaderLanding() {
  const loggedIn = isAuthenticated();
  const path = window.location.pathname;

  let ctaHtml;
  if (path === "/login" || path === "/register") {
    ctaHtml = `<li><a class="header-nav-link header-nav-cta" href="/" data-link>${t("nav.back-home")}</a></li>`;
  } else if (loggedIn) {
    ctaHtml = `<li><a class="header-nav-link header-nav-cta" href="/home" data-link>${t("nav.home")}</a></li>`;
  } else {
    ctaHtml = `<li><a class="header-nav-link header-nav-cta" href="/login" data-link>${t("nav.login")}</a></li>`;
  }

  return `
  <header class="header-landing flex flex-row justify-between">
    <div>
      <a id="btn-home" class="header-logo" href="/" data-link>${t("app.name")}</a>
    </div>
    <button id="mobile-menu-btn" class="mobile-menu-btn" aria-label="${t("header.toggle_nav")}">☰</button>
    <nav id="mobile-nav" class="header-landing-nav">
      <ul class="header-nav-list flex flex-row justify-around">
        <li class="desktop-lang-item">${langToggleHtml()}</li>
        <li><a class="header-nav-link" href="/#explore-reports">${t("nav.explore")}</a></li>
        <li><a class="header-nav-link" href="/#how-it-works">${t("nav.how-it-works")}</a></li>
        <li><a class="header-nav-link" href="/#about-us">${t("nav.about-us")}</a></li>
        <li><a class="header-nav-link" href="/announcements" data-link>${t("nav.announcements")}</a></li>
        ${ctaHtml}
      </ul>
      <div class="mobile-lang-wrapper">${langToggleHtml()}</div>
    </nav>
  </header>
`;
}

export function initHeaderLanding() {
  const btn = document.getElementById("mobile-menu-btn");
  const nav = document.getElementById("mobile-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    nav.classList.toggle("open");
    btn.textContent = nav.classList.contains("open") ? "✕" : "☰";
  });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("open") && !nav.contains(e.target) && e.target !== btn) {
      nav.classList.remove("open");
      btn.textContent = "☰";
    }
  });
}

export function HeaderHome() {
  const user = authStore.user;
  return`
  <header class="header-home flex flex-row justify-between items-center">
    <button id="sidebar-toggle" class="sidebar-toggle-btn">☰</button>
    <a id="button-home" class="header-logo" href="/" data-link>${t("app.name")}</a>
    <div class="flex flex-row items-center gap-2">
      <a id="button-profile" href="/profile" data-link class="header-icon">${user?.avatar_url
        ? `<img src="${UPLOADS_BASE}${user.avatar_url}" alt="${user.name}" class="header-avatar" />`
        : `<img src="/user.svg" alt="user" class="header-avatar" />`
      }<span class="header-username">${user?.name || t("header.user_fallback")}</span></a>
    </div>
  </header>
  `
}

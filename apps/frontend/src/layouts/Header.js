import { isAuthenticated } from "@core/helpers";
import { authStore } from "@store/auth.store";

export function HeaderLanding() {
  const loggedIn = isAuthenticated();
  const path = window.location.pathname;

  let ctaHtml;
  if (path === "/login") {
    ctaHtml = '<li><a class="header-nav-link header-nav-cta" href="/" data-link>Home</a></li>';
  } else if (loggedIn) {
    ctaHtml = '<li><a class="header-nav-link header-nav-cta" href="/home" data-link>Login</a></li>';
  } else {
    ctaHtml = '<li><a class="header-nav-link header-nav-cta" href="/login" data-link>Login</a></li>';
  }

  return `
  <header class="header-landing flex flex-row justify-between">
    <div>
      <a id="btn-home" class="header-logo" href="/" data-link>CoDecide</a>
    </div>
    <button id="mobile-menu-btn" class="mobile-menu-btn" aria-label="Toggle navigation">☰</button>
    <nav id="mobile-nav" class="header-landing-nav">
      <ul class="header-nav-list flex flex-row justify-around">
        <li><a class="header-nav-link" href="#explore-reports">Explore Reports</a></li>
        <li><a class="header-nav-link" href="#how-it-works">How It Works</a></li>
        <li><a class="header-nav-link" href="#about-us">About Us</a></li>
        <li><a class="header-nav-link" href="/announcements" data-link>Announcements</a></li>
        ${ctaHtml}
      </ul>
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
    <a id="button-home" class="header-logo" href="/" data-link>CoDecide</a>
    <a id="button-profile" href="/profile" data-link class="header-icon"><img src="/user.svg" alt="user">${user?.name || "User"}</a>
  </header>
  `
}

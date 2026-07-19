import { AccessDeniedPageView } from "@pages/AccessDeniedPage";
import { LandingPageView } from "@pages/landing/LandingPage";
import { AuthView, initAuth } from "@pages/auth/AuthPage";
import { CreateReportView, initCreateReportView } from "@pages/reports/create";
import { AdminDashboardView } from "@pages/admin/dashboard";
import { HomePageView, initHomePage } from "@pages/home/HomePage";
import { ProfilePageView, initProfilePage } from "@pages/profile/ProfilePage";
import { ReportsPageView, initReportsPage } from "@pages/reports/ReportsPage";
import { DetailPageView } from "@pages/reports/DetailPage";
import { AnnouncementsPageView } from "@pages/announcements/AnnouncementsPage";
import { StatsPageView } from "@pages/stats/StatsPage";
import { SuccessPageView } from "@pages/reports/SuccessPage";
import { NotFoundPageView } from "@pages/NotFoundPage";
import { isAuthenticated, isAdmin } from "@core/helpers";
import { navigateTo } from "@core/helpers";

export { navigateTo };

function bindDataLinks() {
  document.querySelectorAll("[data-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute("href"));
    });
  });
}

function render(app, view, init) {
  app.innerHTML = view;
  bindDataLinks();
  if (init) init();
}

function guard(path) {
  const app = document.querySelector("#app");

  if (isAuthenticated() && (path === "/login" || path === "/register")) {
    history.replaceState({}, "", "/home");
    render(app, HomePageView(), initHomePage);
    return true;
  }

  if (!isAuthenticated() && path !== "/login" && path !== "/register" && path !== "/announcements") {
    history.replaceState({}, "", "/");
    render(app, LandingPageView());
    return true;
  }

  if (path === "/admin" && !isAdmin()) {
    render(app, AccessDeniedPageView());
    return true;
  }

  return false;
}

const routes = [
  { path: "/login",       view: () => AuthView("login"),         init: () => initAuth("login") },
  { path: "/register",    view: () => AuthView("register"),      init: () => initAuth("register") },
  { path: "/home",        view: HomePageView,                    init: initHomePage },
  { path: "/profile",     view: ProfilePageView,                 init: initProfilePage },
  { path: "/reports",     view: ReportsPageView,                 init: initReportsPage },
  { path: "/reports/create", view: CreateReportView,             init: () => initCreateReportView(() => navigateTo("/reports/success")) },
  { path: "/admin",       view: AdminDashboardView },
  { path: "/announcements", view: AnnouncementsPageView },
  { path: "/stats",       view: StatsPageView },
  { path: "/reports/success", view: SuccessPageView },
  { test: /^\/reports\/(\d+)$/, view: (m) => DetailPageView(m[1]) },
];

export const router = () => {
  const app = document.querySelector("#app");
  const path = window.location.pathname;

  if (path === "/") {
    render(app, LandingPageView());
    return;
  }

  if (guard(path)) return;

  for (const r of routes) {
    if (r.test) {
      const m = path.match(r.test);
      if (m) { render(app, r.view(m)); return; }
    } else if (r.path === path) {
      render(app, r.view(), r.init);
      return;
    }
  }

  render(app, NotFoundPageView());
};

window.addEventListener("popstate", router);

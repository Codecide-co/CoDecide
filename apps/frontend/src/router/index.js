import { LandingView } from "@pages/home/LandingView";
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

const adminOnlyRoutes = ["/admin"];

export { navigateTo };

export const router = () => {
  const app = document.querySelector("#app");
  const path = window.location.pathname;

  if (path === "/") {
    app.innerHTML = LandingView();
    return;
  }

  if (isAuthenticated() && (path === "/login" || path === "/register")) {
    history.replaceState({}, "", "/home");
    app.innerHTML = HomePageView();
    initHomePage();
    return;
  }

  if (!isAuthenticated() && path !== "/login" && path !== "/register" && path !== "/announcements") {
    history.replaceState({}, "", "/");
    app.innerHTML = LandingView();
    return;
  }

  if (adminOnlyRoutes.includes(path) && !isAdmin()) {
    app.innerHTML = `
      <div class="min-h-screen flex flex-col items-center justify-center bg-slate-100 gap-4">
        <div class="bg-white rounded-xl shadow p-10 text-center max-w-sm">
          <p class="text-5xl mb-4"><i class="fa-solid fa-ban text-red-600"></i></p>
          <h2 class="text-2xl font-bold text-red-600 mb-2">Access denied</h2>
          <p class="text-slate-500 mb-6">You do not have permission to access this section.</p>
          <button id="backHome" class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            Back to home
          </button>
        </div>
      </div>
    `;
    document.querySelector("#backHome")?.addEventListener("click", () => navigateTo("/home"));
    return;
  }

  const reportMatch = path.match(/^\/reports\/(\d+)$/);
  if (reportMatch) {
    app.innerHTML = DetailPageView(reportMatch[1]);
    document.querySelectorAll("[data-link]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo(link.getAttribute("href"));
      });
    });
    return;
  }

  if (path === "/login" || path === "/register") {
    const formName = path === "/register" ? "register" : "login";
    app.innerHTML = AuthView(formName);
    initAuth(formName);
  } else if (path === "/home") {
    app.innerHTML = HomePageView();
    initHomePage();
  } else if (path === "/profile") {
    app.innerHTML = ProfilePageView();
    initProfilePage();
  } else if (path === "/reports") {
    app.innerHTML = ReportsPageView();
    initReportsPage();
  } else if (path === "/reports/create") {
    app.innerHTML = CreateReportView();
    initCreateReportView(() => navigateTo("/reports/success"));
  } else if (path === "/admin") {
    app.innerHTML = AdminDashboardView();
  } else if (path === "/announcements") {
    app.innerHTML = AnnouncementsPageView();
  } else if (path === "/stats") {
    app.innerHTML = StatsPageView();
  } else if (path === "/reports/success") {
    app.innerHTML = SuccessPageView();
  } else {
    app.innerHTML = NotFoundPageView();
  }

  document.querySelectorAll("[data-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute("href"));
    });
  });
};

window.addEventListener("popstate", router);

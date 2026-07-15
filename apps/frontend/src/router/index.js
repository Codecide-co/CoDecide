import loginView from "@/views/loginView.js";
import registerView from "@/views/registerView.js";
import homeView from "@/views/homeView.js";
import createReportView from "@/views/createReportView.js";
import reportSuccessView from "@/views/reportSuccessView.js";
import { LandingView } from "@pages/home/LandingView";
import notFoundView from "@/views/notFound.js";
import { isAuthenticated, isAdmin } from "@/utils/utils.js";
import { navigateTo } from "@/utils/navigate.js";

const routes = {
  "/": LandingView,
  "/login": loginView,
  "/register": registerView,
  "/home": homeView,
  "/reports/create": createReportView,
  "/reports/success": reportSuccessView,
};

const adminOnlyRoutes = ["/admin"];

export { navigateTo };

export const router = () => {
  const app = document.querySelector("#app");
  const path = window.location.pathname;

  if (path === "/") {
    app.innerHTML = LandingView();
    return;
  }

  if (!isAuthenticated() && path !== "/login" && path !== "/register") {
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

  const view = routes[path] || notFoundView;
  app.innerHTML = view();

  document.querySelectorAll("[data-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute("href"));
    });
  });
};

window.addEventListener("popstate", router);

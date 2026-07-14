import loginView from "@/views/loginView.js";
import registerView from "@/views/registerView.js";
import homeView from "@/views/homeView.js";
import { LandingView } from "@pages/home/LandingView";
import notFoundView from "@/views/notFound.js";
import { isAuthenticated } from "@/utils/utils.js";
import { navigateTo } from "@/utils/navigate.js";

const routes = {
  "/": LandingView,
  "/login": loginView,
  "/register": registerView,
  "/home": homeView,
};

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

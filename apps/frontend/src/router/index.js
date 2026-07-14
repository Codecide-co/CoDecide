const routes = {
  "/landing": {
    load: () => import("@pages/home/LandingView"),
    view: "LandingView",
  },
  "/login": {
    load: () => import("@pages/auth/AuthPage"),
    view: "AuthView",
    init: "initAuth",
    param: "login",
  },
  "/register": {
    load: () => import("@pages/auth/AuthPage"),
    view: "AuthView",
    init: "initAuth",
    param: "register",
  },
};

const SECTION_ANCHORS = ["/explore-reports", "/hero-landing", "/how-it-works", "/about-us"];

export function initRouter() {
  function handleRoute() {
    const hash = window.location.hash;
    const path = window.location.hash.slice(1) || "/landing";
    const app = document.getElementById("app");
    const route = routes[path];

    if (!route && SECTION_ANCHORS.includes(path)) {
      const landing = routes["/landing"];
      landing.load().then((module) => {
        app.innerHTML = module[landing.view]();
        
        requestAnimationFrame(() => {
          const el = document.getElementById(path.slice(1));
          if (el) el.scrollIntoView({ behavior: "smooth" });
        });
      });
      return;
    } 

    if (hash && !hash.startsWith("#/")) return;

    if (route) {
      route.load().then((module) => {
        app.innerHTML = module[route.view](route.param);
        if (route.init && module[route.init]) {
          module[route.init](route.param);
        }
      });
    } else {
      window.location.hash = "#/landing";
    }
  }

  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}

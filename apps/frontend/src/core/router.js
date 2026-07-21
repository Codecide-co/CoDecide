export function createRouter(routes, { onRoute } = {}) {
  function resolve() {
    const path = window.location.pathname;

    for (const route of routes) {
      if (route.pattern) {
        const match = path.match(route.pattern);
        if (match) {
          onRoute?.({ ...route, params: match.groups || {} });
          return;
        }
      }
      if (route.path === path) {
        onRoute?.({ ...route, params: {} });
        return;
      }
    }
  }

  window.addEventListener("popstate", resolve);

  return { resolve, navigateTo };
}

export function navigateTo(path) {
  history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

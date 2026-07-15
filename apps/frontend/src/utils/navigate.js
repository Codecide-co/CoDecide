export const navigateTo = (path) => {
  history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function saveSession(user) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
  sessionStorage.setItem("token", user.token);
}

export function getSession() {
  return JSON.parse(sessionStorage.getItem("currentUser"));
}

export function getSessionToken() {
  return getSession()?.token;
}

export function removeSession() {
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("token");
}

export function isAuthenticated() {
  return !!getSession();
}

export function isAdmin() {
  return getSession()?.role === "admin";
}

export function navigateTo(path) {
  history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

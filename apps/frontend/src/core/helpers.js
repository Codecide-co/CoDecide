let _routeState = null;

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

export function getRouteState() {
  const state = _routeState;
  _routeState = null;
  return state;
}

export function navigateTo(path, state) {
  _routeState = state || null;
  history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function dateLocale() {
  try {
    const lang = localStorage.getItem("language");
    return lang === "es" ? "es-CO" : "en-GB";
  } catch {
    return "en-GB";
  }
}

export function formatDate(dateStr, style = "short") {
  const d = new Date(dateStr);
  const loc = dateLocale();
  if (isNaN(d.getTime())) return "—";
  switch (style) {
    case "datetime":
      return `${d.toLocaleDateString(loc)} ${d.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" })}`;
    case "long":
      return d.toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" });
    case "medium":
      return d.toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" });
    case "full":
      return d.toLocaleString(loc);
    default:
      return d.toLocaleDateString(loc);
  }
}

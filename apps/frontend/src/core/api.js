const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const UPLOADS_BASE = import.meta.env.VITE_UPLOADS_BASE || "http://localhost:5000";

let getToken = () => null;

let onUnauthorized = null;

export function configureApi({ tokenGetter, unauthorizedHandler }) {
  getToken = tokenGetter;
  onUnauthorized = unauthorizedHandler;
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 && onUnauthorized) {
      onUnauthorized(data.error || "Session expired");
    }
    const error = new Error(data.error || data.msg || "Something went wrong");
    error.status = res.status;
    throw error;
  }
  return data;
}

function langParam() {
  try {
    const lang = localStorage.getItem("language");
    if (lang === "en" || lang === "es") return `lang=${lang}`;
  } catch {}
  return "lang=es";
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const sep = path.includes("?") ? "&" : "?";
  const url = API_URL + path + sep + langParam();
  const res = await fetch(url, { ...options, headers });
  return handleResponse(res);
}

export async function fetchApiData(path) {
  return request(path);
}

export async function postApiData(path, body) {
  return request(path, { method: "POST", body: JSON.stringify(body) });
}

export async function updateApiData(path, body) {
  return request(path, { method: "PUT", body: JSON.stringify(body) });
}

export async function patchApiData(path, body) {
  return request(path, { method: "PATCH", body: JSON.stringify(body) });
}

export async function deleteApiData(path) {
  return request(path, { method: "DELETE" });
}

export async function postFormData(path, formData) {
  const token = getToken();
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(API_URL + path, {
    method: "POST",
    headers,
    body: formData,
  });
  return handleResponse(res);
}

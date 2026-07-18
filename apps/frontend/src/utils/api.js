import { getToken } from "@store/auth.store";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const UPLOADS_BASE = import.meta.env.VITE_UPLOADS_BASE || "http://localhost:5000";

async function request(path, options = {}) {
  const token = getToken();

  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(API_URL + path, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.error || data.msg || "Something went wrong");
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function fetchApiData(path) {
  return request(path);
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

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.error || data.msg || "Something went wrong");
    error.status = res.status;
    throw error;
  }
  return data;
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
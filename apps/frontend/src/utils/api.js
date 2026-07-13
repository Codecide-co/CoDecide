const API_URL = "http://localhost:5000/api";

function getToken() {
  return sessionStorage.getItem("token"); // guarda el token
}

// funcion interna que todas las demas HTTP llaman
async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; 
  }

  const res = await fetch(API_URL + path, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.error || "Something went wrong");
    error.status = res.status;
    throw error;
  }
  return data;
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

export async function deleteApiData(path) {
  return request(path, { method: "DELETE" });
}
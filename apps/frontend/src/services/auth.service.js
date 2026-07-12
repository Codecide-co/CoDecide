import { fetchApiData, postApiData } from "@utils/api";

// Error tipado, para distinguir "credeciales invalidas (401)" 
export class AuthError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "AuthError";
        this.status = status;
    }
}

// Register - M
export async function register(user) {
  const data = await postApiData("/auth/register", user);
  localStorage.setItem("token", data.token);
  localStorage.setItem("currentUser", JSON.stringify(data));
  return data;
}

// Exit - M
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
}

// Get User - M
export function getCurrentUser() {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
}

// Login - M
export async function login(email, password) {
  const data = await postApiData("/auth/login", { email, password });
  localStorage.setItem("token", data.token);
  localStorage.setItem("currentUser", JSON.stringify(data));
  return { user: data, token: data.token };
}
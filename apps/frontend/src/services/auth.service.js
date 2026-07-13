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
  sessionStorage.setItem("token", data.token);
  sessionStorage.setItem("currentUser", JSON.stringify(data));
  return data;
}

// Exit - M
export async function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("currentUser");
}

// Get User - M
export function getCurrentUser() {
    const stored = sessionStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
}

// Login - M
export async function login(email, password) {
  const data = await postApiData("/auth/login", { email, password });
  sessionStorage.setItem("token", data.token);
  sessionStorage.setItem("currentUser", JSON.stringify(data));
  return { user: data, token: data.token };
}
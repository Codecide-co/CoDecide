import { postApiData } from "@utils/api";
import { saveSession, removeSession } from "@helpers/auth.helpers";

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
  saveSession(data);
  return data;
}

// Exit - M
export async function logout() {
  removeSession();
}

// Login - M
export async function login(email, password) {
  const data = await postApiData("/auth/login", { email, password });
  saveSession(data);
  return data
}
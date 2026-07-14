import { postApiData } from "@utils/api";

export class AuthError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

export async function register(user) {
  return postApiData("/auth/register", user);
}

export async function login(email, password) {
  return postApiData("/auth/login", { email, password });
}

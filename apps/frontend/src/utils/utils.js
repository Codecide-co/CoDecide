import { authStore } from "@store/auth.store";

export const isAuthenticated = () => authStore.isAuthenticated;
export const isAdmin = () => authStore.isAdmin;

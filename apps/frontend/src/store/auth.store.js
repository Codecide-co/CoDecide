import { postApiData } from "@utils/api";
import { saveSession, removeSession, getSession, getSessionToken } from "@helpers/auth.helpers";

const state = {
  user: getSession(),
  subscribers: new Set(),
};

export const authStore = new Proxy(state, {
  get(target, prop) {
    if (prop === "isAuthenticated") return !!target.user;
    if (prop === "isAdmin") return target.user?.role === "admin";
    if (prop === "user") return target.user;
    if (prop === "subscribe") return (fn) => {
      target.subscribers.add(fn);
      return () => target.subscribers.delete(fn);
    };
    return target[prop];
  },
  set(target, prop, value) {
    if (prop === "user") {
      target.user = value;
      target.subscribers.forEach((fn) => fn(value));
      return true;
    }
    return false;
  },
});

export async function login(email, password) {
  const data = await postApiData("/auth/login", { email, password });
  saveSession(data);
  authStore.user = data;
  return data;
}

export async function register(user) {
  const data = await postApiData("/auth/register", user);
  saveSession(data);
  authStore.user = data;
  return data;
}

export function logout() {
  removeSession();
  authStore.user = null;
}

export function getToken() {
  return getSessionToken();
}

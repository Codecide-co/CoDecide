import { LoginView, initLoginView } from "@pages/auth/login.view";
import { navigateTo } from "@/utils/navigate.js";

export default function loginView() {
  setTimeout(() => initLoginView(() => navigateTo("/home")), 0);
  return LoginView();
}

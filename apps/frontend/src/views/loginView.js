import { HeaderLanding } from "@layout/Header";
import { viewHeroLogin } from "@pages/auth/heroLogin";
import { LoginView, initLoginView } from "@pages/auth/login.view";
import { navigateTo } from "@/utils/navigate.js";

export default function loginView() {
  setTimeout(() => initLoginView(() => navigateTo("/home")), 0);
  return `
  ${HeaderLanding()}
  <section class="auth-page flex flex-col lg:flex-row">
    <div class="auth-hero">${viewHeroLogin()}</div>
    <div class="auth-form-container">${LoginView()}</div>
  </section>
`;
}
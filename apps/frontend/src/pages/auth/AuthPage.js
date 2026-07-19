import { viewHeroLogin } from "./heroLogin";
import { LoginFormView, initLoginForm } from "./LoginForm";
import { RegisterFormView, initRegisterForm } from "./RegisterForm";
import { HeaderLanding } from "@/layouts/Header";
import { navigateTo } from "@core/helpers";

export function AuthView(formName) {
  return `
  ${HeaderLanding()}
  <section class="auth-page flex flex-col lg:flex-row">
    <div class="auth-hero">${viewHeroLogin()}</div>
    <div class="auth-form-container" id="auth-dynamic">
      ${formName === "register" ? RegisterFormView() : LoginFormView()}
    </div>
  </section>
  `;
}

export function initAuth(formName) {
  if (formName === "register") {
    initRegisterForm(() => window.location.hash = "#/login");
  } else {
    initLoginForm(() => navigateTo("/home"));
  }
}
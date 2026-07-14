import { viewHeroLogin } from "./heroLogin";
import { LoginView, initLoginView } from "./login.view";
import { RegisterView, initRegisterView } from "./register.view";
import { HeaderLanding } from "@/layout/Header";

export function AuthView(formName) {
  return `
  ${HeaderLanding()}
  <section class="auth-page">
    <div class="auth-hero">${viewHeroLogin()}</div>
    <div class="auth-form-container" id="auth-dynamic">
      ${formName === "register" ? RegisterView() : LoginView()}
    </div>
  </section>
  `;
}

export function initAuth(formName) {
  if (formName === "register") {
    initRegisterView(() => window.location.hash = "#/login");
  } else {
    initLoginView(() => {
      document.getElementById("auth-dynamic").innerHTML = "<h2>Welcome back!</h2><p>Login successful.</p>";
    });
  }
}
import { HeaderLanding } from "@layout/Header";
import { viewHeroLogin } from "@pages/auth/heroLogin";
import { RegisterView, initRegisterView } from "@pages/auth/register.view";
import { navigateTo } from "@/utils/navigate.js";

export default function registerView() {
  setTimeout(() => initRegisterView(() => navigateTo("/")), 0);
  return `
    ${HeaderLanding()}
    <section class="auth-page">
      <div class="auth-hero">${viewHeroLogin()}</div>
      <div class="auth-form-container">${RegisterView()}</div>
    </section>
  `;
}

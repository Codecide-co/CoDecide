import { t } from "@core/i18n";
import { login } from "@services/auth.service";
import { saveSession } from "@core/helpers";
import { authStore } from "@store/auth.store";
import { validateLoginForm } from "@core/validators";
import { useFormSubmit } from "@components/forms/FormHelper";
import { navigateTo } from "@core/helpers";

export function initLoginForm(onSuccess) {
  useFormSubmit("login-form", {
    validator: validateLoginForm,
    onSubmit: async ({ email, password }) => {
      const data = await login(email, password);
      saveSession(data);
      authStore.user = data;
    },
    onSuccess,
  });

  document.getElementById("go-register")?.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("/register");
  });

  const togglePasswordBtn = document.getElementById("toggle-password");
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const input = document.getElementById("password");
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      togglePasswordBtn.textContent = showing ? t("auth.login.password_hide") : t("auth.login.password_show");
    });
  }
}

export function LoginFormView() {
  return `
  <section class="auth-form-section">
    <header class="auth-form-header">
      <h2 class="auth-form-title">${t("auth.login.title")}</h2>
      <p class="auth-form-desc">${t("auth.login.subtitle")}</p>
    </header>
    <form id="login-form" class="auth-form" novalidate>
      <div class="auth-form-group">
        <label class="auth-form-label" for="email">${t("auth.login.email_label")}</label>
        <input class="auth-form-input" id="email" name="email" type="email" placeholder="${t("auth.login.email_placeholder")}">
        <small class="auth-form-error" id="email-error"></small>
      </div>
      <div class="auth-form-group">
        <label class="auth-form-label" for="password">${t("auth.login.password_label")}</label>
        <div class="auth-password-field">
          <input class="auth-form-input" id="password" name="password" type="password" placeholder="${t("auth.login.password_placeholder")}">
          <button type="button" class="auth-form-toggle" id="toggle-password" aria-label="${t("auth.login.password_aria")}">${t("auth.login.password_show")}</button>
        </div>
        <small class="auth-form-error" id="password-error"></small>
      </div>
      <div class="auth-form-error-global" id="login-error" role="alert"></div>
      <button class="auth-form-submit" id="login-btn" type="submit">${t("auth.login.submit")}</button>
    </form>
    <div class="auth-form-footer">
      <p>${t("auth.login.footer_text")} <a href="/register" id="go-register">${t("auth.login.footer_link")}</a></p>
    </div>
  </section>`;
}
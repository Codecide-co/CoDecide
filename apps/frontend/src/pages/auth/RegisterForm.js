import { t } from "@core/i18n";
import { register } from "@services/auth.service";
import { validateRegisterForm } from "@core/validators";
import { useFormSubmit } from "@components/forms/FormHelper";
import { navigateTo } from "@core/helpers";

export function initRegisterForm(onSuccess) {
  useFormSubmit("register-form", {
    validator: validateRegisterForm,
    onSubmit: (values) => {
      const { confirmPassword, ...user } = values;
      return register(user);
    },
    onSuccess,
  });

  function bindToggle(buttonId, input) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      if (buttonId === "toggle-confirm-password") {
        btn.textContent = showing ? t("auth.register.confirm_hide") : t("auth.register.confirm_show");
      } else {
        btn.textContent = showing ? t("auth.register.password_hide") : t("auth.register.password_show");
      }
    });
  }

  bindToggle("toggle-password", document.getElementById("password"));
  bindToggle("toggle-confirm-password", document.getElementById("confirm-password"));

  document.getElementById("go-login")?.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("/login");
  });
}

export function RegisterFormView() {
  return `
<section class="auth-form-section">
  <header class="auth-form-header">
    <h2 class="auth-form-title">${t("auth.register.title")}</h2>
    <p class="auth-form-desc">${t("auth.register.subtitle")}</p>
  </header>
  <form id="register-form" class="auth-form" novalidate>
    <div class="auth-form-group">
      <label class="auth-form-label" for="name">${t("auth.register.name_label")}</label>
      <input class="auth-form-input" id="name" name="name" type="text" placeholder="${t("auth.register.name_placeholder")}">
      <small class="auth-form-error" id="name-error"></small>
    </div>
    <div class="auth-form-group">
      <label class="auth-form-label" for="email">${t("auth.register.email_label")}</label>
      <input class="auth-form-input" id="email" name="email" type="email" placeholder="${t("auth.register.email_placeholder")}">
      <small class="auth-form-error" id="email-error"></small>
    </div>
    <div class="auth-form-grid">
      <div class="auth-form-group">
        <label class="auth-form-label" for="tower">${t("auth.register.tower_label")}</label>
        <input class="auth-form-input" id="tower" name="tower" type="text" placeholder="${t("auth.register.tower_placeholder")}">
        <small class="auth-form-error" id="tower-error"></small>
      </div>
      <div class="auth-form-group">
        <label class="auth-form-label" for="apartment">${t("auth.register.apartment_label")}</label>
        <input class="auth-form-input" id="apartment" name="apartment" type="text" placeholder="${t("auth.register.apartment_placeholder")}">
        <small class="auth-form-error" id="apartment-error"></small>
      </div>
    </div>
    <div class="auth-form-group">
      <label class="auth-form-label" for="password">${t("auth.register.password_label")}</label>
      <div class="auth-password-field">
        <input class="auth-form-input" id="password" name="password" type="password" placeholder="${t("auth.register.password_placeholder")}">
        <button type="button" class="auth-form-toggle" id="toggle-password" aria-label="${t("auth.register.password_aria")}">${t("auth.register.password_show")}</button>
      </div>
      <small class="auth-form-error" id="password-error"></small>
    </div>
    <div class="auth-form-group">
      <label class="auth-form-label" for="confirmPassword">${t("auth.register.confirm_label")}</label>
      <div class="auth-password-field">
        <input class="auth-form-input" id="confirm-password" name="confirmPassword" type="password" placeholder="${t("auth.register.confirm_placeholder")}">
        <button type="button" class="auth-form-toggle" id="toggle-confirm-password" aria-label="${t("auth.register.confirm_aria")}">${t("auth.register.confirm_show")}</button>
      </div>
      <small class="auth-form-error" id="confirmPassword-error"></small>
    </div>
    <div class="auth-form-error-global" id="register-error" role="alert"></div>
    <button class="auth-form-submit" id="register-btn" type="submit">${t("auth.register.submit")}</button>
  </form>
  <div class="auth-form-footer">
    <p>${t("auth.register.footer_text")} <a href="/login" id="go-login">${t("auth.register.footer_link")}</a></p>
  </div>
</section>
`;
}
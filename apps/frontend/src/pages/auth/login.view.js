import { login } from "@store/auth.store";
import { validateLoginForm } from "@utils/validators";
import { useFormSubmit } from "@helpers/form.helper";
import { navigateTo } from "@/utils/navigate.js";

export function initLoginView(onSuccess) {
  useFormSubmit("login-form", {
    validator: validateLoginForm,
    onSubmit: ({ email, password }) => login(email, password),
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
      togglePasswordBtn.textContent = showing ? "Show" : "Hide";
    });
  }
}

export function LoginView() {
  return `
  <section class="auth-form-section">
    <header class="auth-form-header">
      <h2 class="auth-form-title">Log In</h2>
      <p class="auth-form-desc">Sign in to your account to access the platform.</p>
    </header>
    <form id="login-form" class="auth-form" novalidate>
      <div class="auth-form-group">
        <label class="auth-form-label" for="email">Email Address</label>
        <input class="auth-form-input" id="email" name="email" type="email" placeholder="email@example.com">
        <small class="auth-form-error" id="email-error"></small>
      </div>
      <div class="auth-form-group">
        <label class="auth-form-label" for="password">Password</label>
        <div class="auth-password-field">
          <input class="auth-form-input" id="password" name="password" type="password" placeholder="••••••••">
          <button type="button" class="auth-form-toggle" id="toggle-password" aria-label="Show password">Show</button>
        </div>
        <small class="auth-form-error" id="password-error"></small>
      </div>
      <div class="auth-form-error-global" id="login-error" role="alert"></div>
      <button class="auth-form-submit" id="login-btn" type="submit">Log In</button>
    </form>
    <div class="auth-form-footer">
      <p>Don't have an account? <a href="/register" id="go-register">Sign Up</a></p>
    </div>
  </section>`;
}
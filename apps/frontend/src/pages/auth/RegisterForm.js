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
      btn.textContent = showing ? "Show" : "Hide";
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
    <h2 class="auth-form-title">Create Account</h2>
    <p class="auth-form-desc">Join your community and start reporting incidents.</p>
  </header>
  <form id="register-form" class="auth-form" novalidate>
    <div class="auth-form-group">
      <label class="auth-form-label" for="name">Full Name</label>
      <input class="auth-form-input" id="name" name="name" type="text" placeholder="John Doe">
      <small class="auth-form-error" id="name-error"></small>
    </div>
    <div class="auth-form-group">
      <label class="auth-form-label" for="email">Email Address</label>
      <input class="auth-form-input" id="email" name="email" type="email" placeholder="email@example.com">
      <small class="auth-form-error" id="email-error"></small>
    </div>
    <div class="auth-form-grid">
      <div class="auth-form-group">
        <label class="auth-form-label" for="tower">Tower</label>
        <input class="auth-form-input" id="tower" name="tower" type="text" placeholder="A">
        <small class="auth-form-error" id="tower-error"></small>
      </div>
      <div class="auth-form-group">
        <label class="auth-form-label" for="apartment">Apartment</label>
        <input class="auth-form-input" id="apartment" name="apartment" type="text" placeholder="302">
        <small class="auth-form-error" id="apartment-error"></small>
      </div>
    </div>
    <div class="auth-form-group">
      <label class="auth-form-label" for="password">Password</label>
      <div class="auth-password-field">
        <input class="auth-form-input" id="password" name="password" type="password" placeholder="••••••••">
        <button type="button" class="auth-form-toggle" id="toggle-password" aria-label="Show password">Show</button>
      </div>
      <small class="auth-form-error" id="password-error"></small>
    </div>
    <div class="auth-form-group">
      <label class="auth-form-label" for="confirmPassword">Confirm Password</label>
      <div class="auth-password-field">
        <input class="auth-form-input" id="confirm-password" name="confirmPassword" type="password" placeholder="••••••••">
        <button type="button" class="auth-form-toggle" id="toggle-confirm-password" aria-label="Show password">Show</button>
      </div>
      <small class="auth-form-error" id="confirmPassword-error"></small>
    </div>
    <div class="auth-form-error-global" id="register-error" role="alert"></div>
    <button class="auth-form-submit" id="register-btn" type="submit">Create Account</button>
  </form>
  <div class="auth-form-footer">
    <p>Already have an account? <a href="/login" id="go-login">Log In</a></p>
  </div>
</section>
`;
}
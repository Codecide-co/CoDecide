import { register } from "@store/auth.store";
import { validateRegisterForm } from "@utils/validators";
import { useFormSubmit } from "@helpers/form.helper";

export function initRegisterView(onSuccess) {
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
    location.replace("#/login");
  });
}

export function RegisterView() {
  return `
<section>

  <header>
    <h2>Create Account</h2>
    <p>Join your community and start reporting incidents.</p>
  </header>

  <form id="register-form" novalidate>

    <div>
      <label for="name">Full Name</label>
      <input id="name" name="name" type="text" placeholder="John Doe">
      <small id="name-error"></small>
    </div>

    <div>
      <label for="email">Email Address</label>
      <input id="email" name="email" type="email" placeholder="email@example.com">
      <small id="email-error"></small>
    </div>

    <div>
      <div>
        <label for="tower">Tower</label>
        <input id="tower" name="tower" type="text" placeholder="A">
        <small id="tower-error"></small>
      </div>

      <div>
        <label for="apartment">Apartment</label>
        <input id="apartment" name="apartment" type="text" placeholder="302">
        <small id="apartment-error"></small>
      </div>
    </div>

    <div>
      <label for="password">Password</label>
      <div class="password-field">
        <input id="password" name="password" type="password" placeholder="••••••••">
        <button type="button" id="toggle-password" aria-label="Show password">
            Show
        </button>
      </div>
      <small id="password-error"></small>
    </div>

    <div>
      <label for="confirmPassword">
        Confirm Password
      </label>
      <div class="password-field">
        <input id="confirm-password" name="confirmPassword" type="password" placeholder="••••••••">
        <button type="button" id="toggle-confirm-password" aria-label="Show password">
            Show
        </button>
      </div>
      <small id="confirmPassword-error"></small>
    </div>

    <div id="register-error" role="alert"></div>

    <button id="register-btn" type="submit">
      Create Account
    </button>
  </form>

  <div>
    <p>Already have an account? <a href="#/login" id="go-login">Log In</a></p>
  </div>
</section>
`;
}

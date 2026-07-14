import { login } from "@store/auth.store";
import { validateLoginForm } from "@utils/validators";
import { useFormSubmit } from "@helpers/form.helper";

export function initLoginView(onSuccess) {
  useFormSubmit("login-form", {
    validator: validateLoginForm,
    onSubmit: ({ email, password }) => login(email, password),
    onSuccess,
  });

  document.getElementById("go-register")?.addEventListener("click", (e) => {
    e.preventDefault();
    location.replace("#/register");
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
  <section>
  <header>
        <h2>Log In</h2>
        <p>Sign in to your account to access the platform.</p>
    </header>

    <form id="login-form" novalidate>

        <div>
            <label for="email">Email Address</label>
            <input id="email" name="email" type="email" placeholder="email@example.com">
            <small id="email-error"></small>
        </div>

        <div>
            <label for="password">Password</label>
            <div id="password-field">
                <input id="password" name="password" type="password" placeholder="••••••••">
                <button type="button" id="toggle-password" aria-label="Show password">
                    Show
                </button>
            </div>
            <small id="password-error"></small>
        </div>

        <div id="login-error" role="alert"></div>
        <button id="login-btn" type="submit">
            Log In
        </button>

    </form>

    <div>
      <p>Don't have an account? <a href="#/register" id="go-register">Sign Up</a></p>
    </div>

    </section>`;
}

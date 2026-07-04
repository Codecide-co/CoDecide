import { login } from "../../services/auth.service";

export function initLoginView() {
  const form = document.getElementById("login-form");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const user = await login(email, password);

      console.log("Usuario logueado:", user);

      alert("Welcome" + user.name);

      form.reset();
    } catch (error) {
      alert(error.message);
    }
  });
}

export function LoginView() {
  return `
    <section id="auth-card">

    <header id="auth-header">
        <h2>Log In</h2>
        <p>Sign in to your account to access the platform.</p>
    </header>

    <form id="login-form" novalidate>

        <div id="form-group">
            <label for="email">Email Address</label>
            <input id="email" name="email" type="email" placeholder="email@example.com" required>
            <small id="isnput-error"></small>
        </div>

        <div id="form-group">
            <label for="password">Password</label>
            <div id="password-field">
                <input id="password" name="password" type="password" placeholder="••••••••" required>
                <button type="button" id="toggle-password" aria-label="Show password">
                    Show
                </button>
            </div>
            <small id="input-error"></small>
        </div>

        <div id="login-error" id="server-error"></div>

        <button id="login-btn" id="btn btn-primary" type="submit">
            Log In
        </button>

    </form>

    <div id="auth-footer">
        <p>Don't have an account? <a href="#" id="go-register">Sign Up</a></p>
    </div>

    </section>`;
}

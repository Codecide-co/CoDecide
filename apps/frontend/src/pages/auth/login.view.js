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
      alert("Welcome " + user.name);
      form.reset();
    } catch (error) {
      alert(error.message);
    }
  });
}

export function LoginView() {
  return `
    <section>

    <header">
        <h2>Log In</h2>
        <p>Sign in to your account to access the platform.</p>
    </header>

    <form id="login-form" novalidate>

        <div>
            <label for="email">Email Address</label>
            <input id="email" name="email" type="email" placeholder="email@example.com" required>
        </div>

        <div>
            <label for="password">Password</label>
            <div id="password-field">
                <input id="password" name="password" type="password" placeholder="••••••••" required>
                <button type="button" id="toggle-password" aria-label="Show password">
                    Show
                </button>
            </div>
        </div>

        <div id="login-error"></div>

        <button id="login-btn" type="submit">
            Log In
        </button>

    </form>

    <div>
        <p>Don't have an account? <a href="#" id="go-register">Sign Up</a></p>
    </div>

    </section>`;
}

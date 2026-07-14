import { login } from "@services/auth.service";
import { validateLoginForm } from "@utils/validators"; /* Import de validaciones errores - Carlos*/
import { AuthError } from "@services/auth.service";

let isSubmitting = false;

export function initLoginView(onSuccess) {
  const form = document.getElementById("login-form");

  if (!form) return;

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const loginError = document.getElementById("login-error");
  const submitBtn = document.getElementById("login-btn");

  /* funciones de validacion - carlos */

  function clearErrors() {
    emailError.textContent = "";
    passwordError.textContent = "";
    loginError.textContent = "";
  }

  function setLoading(loading) {
    isSubmitting = loading;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? "Signing in..." : "Log In";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) return; /* Condicional - Carlos */

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    /* validaciones con OR - carlos  */

    clearErrors();

    const { isValid, errors } = validateLoginForm({ email, password });
    if (!isValid) {
      emailError.textContent = errors.email || "";
      passwordError.textContent = errors.password || "";
      return;
    }

    setLoading(true);


    try {
      await login(email, password);
      form.reset();
      if (typeof onSuccess === "function") onSuccess(); /* inserccion de condicional - carlos*/
    } catch (error) {
       if (error instanceof AuthError && error.status === 401) {
        loginError.textContent = "Invalid credentials";
      } else {
        loginError.textContent = "Something went wrong. Please try again.";
      }
    }

    setLoading(false);       /* Reincio del boton  -carlos */
    
  });

  document.getElementById("go-register")?.addEventListener("click", (e) => {
    e.preventDefault();
    location.replace("#/register");
  });

  /* validacion alternar contraseña - carlos*/
  const togglePasswordBtn = document.getElementById("toggle-password");
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const showing = passwordInput.type === "text";
      passwordInput.type = showing ? "password" : "text";
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

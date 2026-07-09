import { register } from "../../services/auth.service";
import { validateRegisterForm } from "@/utils/validators";

let isSubmitting = false;

export function initRegisterView(onSuccess) {
  const form = document.getElementById("register-form");

  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const towerInput = document.getElementById("tower");
  const apartmentInput = document.getElementById("apartment");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const towerError = document.getElementById("tower-error");
  const apartmentError = document.getElementById("apartment-error");
  const passwordError = document.getElementById("password-error");
  const confirmPasswordError = document.getElementById("passwordMatch");
  const registerError = document.getElementById("register-error");
  const submitBtn = document.getElementById("register-btn");

  /* funciones de validacion - carlos */

  function clearErrors() {
    nameError.textContent = "";
    emailError.textContent = "";
    towerError.textContent = "";
    apartmentError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    registerError.textContent = "";
  }

  function setLoading(loading) {
    isSubmitting = loading;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? "Creating account..." : "Create Account";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) return; /* Condicional - Carlos */

    const user = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      apartment: apartmentInput.value.trim(),
      tower: towerInput.value.trim(),
    };
    const confirmPassword = confirmPasswordInput.value;

    /* validaciones con OR - carlos  */

    clearErrors();

    const { isValid, errors } = validateRegisterForm({ ...user, confirmPassword });
    if (!isValid) {
      nameError.textContent = errors.name || "";
      emailError.textContent = errors.email || "";
      towerError.textContent = errors.tower || "";
      apartmentError.textContent = errors.apartment || "";
      passwordError.textContent = errors.password || "";
      confirmPasswordError.textContent = errors.confirmPassword || "";
      return;
    }

    setLoading(true);

    try {
      await register(user);
      setLoading(false); /* Reincio del boton  -carlos */
      form.reset();
      if (typeof onSuccess === "function") onSuccess(); /* inserccion de condicional - carlos*/
    } catch (error) {
      setLoading(false);
      registerError.textContent = error.message || "Something went wrong. Please try again.";
    }
  });

  /* validacion alternar contraseña - carlos*/
  function bindToggle(buttonId, input) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.textContent = showing ? "Show" : "Hide";
    });
  }

  bindToggle("toggle-password", passwordInput);
  bindToggle("toggle-confirm-password", confirmPasswordInput);
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
      <small id="passwordMatch"></small>
    </div>

    <div id="register-error" role="alert"></div>

    <button id="register-btn" type="submit">
      Create Account
    </button>
  </form>

  <div>
    <p>Already have an account? <a href="#" id="go-login">Log In</a></p>
  </div>
</section>
`;
}
import { register } from "../../services/auth.service";

export function initRegisterView() {
  const form = document.getElementById("register-form");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
      apartment: document.getElementById("apartment").value.trim(),
      tower: document.getElementById("tower").value.trim(),
    };

    try {
      const newUser = await register(user);

      console.log("Usuario creado:", newUser);

      alert("Registro exitoso :D");

      form.reset();
    } catch (error) {
      alert(error.message);
    }
  });
}

export function RegisterView() {
  return `
<section id="auth-card">

  <header id="auth-header">
    <h2>Create Account</h2>
    <p>Join your community and start reporting incidents.</p>
  </header>

  <form id="register-form">

    <div class="form-group">
      <label for="name">Full Name</label>
      <input id="name" name="name" type="text" placeholder="John Doe" required>
    </div>

    <div class="form-group">
      <label for="email">Email Address</label>
      <input id="email" name="email" type="email" placeholder="email@example.com" required>
    </div>

    <div>
      <div class="form-group">
        <label for="tower">Tower</label>
        <input id="tower" name="tower" type="text" placeholder="A" required>
      </div>

      <div class="form-group">
        <label for="apartment">Apartment</label>
        <input id="apartment" name="apartment" type="text" placeholder="302" required>
      </div>
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <div class="password-field">
        <input id="password" name="password" type="password" placeholder="••••••••" required>
      </div>
      <small class="input-error"></small>
    </div>

    <div class="form-group">
      <label for="confirmPassword">
        Confirm Password
      </label>
      <div class="password-field">
        <input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required>
      </div>
      <small id="passwordMatch"></small>
    </div>

    <div id="register-error"></div>

    <button id="register-btn" type="submit">
      Create Account
    </button>
  </form>

  <div class="auth-footer">
    <p>Already have an account? <a href="#" id="go-login">Log In</a></p>
  </div>

</section>
`;
}

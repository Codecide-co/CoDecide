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

    const passwordConfirm = document.getElementById("confirm-password").value

    if(user.password !== passwordConfirm ){
      alert ("The passwords do not match")
      return
    }

    try {
      const newUser = await register(user);
      form.reset();
    } catch (error) {
      alert(error.message);
    }
  });
}

export function RegisterView() {
  return `
<section>

  <header>
    <h2>Create Account</h2>
    <p>Join your community and start reporting incidents.</p>
  </header>

  <form id="register-form">

    <div>
      <label for="name">Full Name</label>
      <input id="name" name="name" type="text" placeholder="John Doe" required>
    </div>

    <div>
      <label for="email">Email Address</label>
      <input id="email" name="email" type="email" placeholder="email@example.com" required>
    </div>

    <div>
      <div>
        <label for="tower">Tower</label>
        <input id="tower" name="tower" type="text" placeholder="A" required>
      </div>

      <div>
        <label for="apartment">Apartment</label>
        <input id="apartment" name="apartment" type="text" placeholder="302" required>
      </div>
    </div>

    <div>
      <label for="password">Password</label>
      <div class="password-field">
        <input id="password" name="password" type="password" placeholder="••••••••" required>
      </div>
      <small id="input-error-register"></small>
    </div>

    <div">
      <label for="confirmPassword">
        Confirm Password
      </label>
      <div class="password-field">
        <input id="confirm-password" name="confirmPassword" type="password" placeholder="••••••••" required>
      </div>
      <small id="passwordMatch"></small>
    </div>

    <div id="register-error"></div>

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

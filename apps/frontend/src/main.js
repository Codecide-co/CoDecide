import "@/styles/index.css";

import { viewHeroLogin } from "./pages/auth/hero.view";
import { LoginView, initLoginView } from "./pages/auth/login.view";
import { RegisterView, initRegisterView } from "./pages/auth/register.view";

const app = document.getElementById("app");

app.innerHTML = `
  ${viewHeroLogin()}
  <section id="auth-container"></section>
`;

const authContainer = document.getElementById("auth-container");

function showLogin(successMessage) {
  authContainer.innerHTML = LoginView();

  if (successMessage) {
    const loginError = document.getElementById("login-error");
    if (loginError) loginError.textContent = successMessage;
  }

  initLoginView(showHome);

  document.getElementById("go-register").addEventListener("click", (e) => {
    e.preventDefault();
    showRegister();
  });
}
/* Reemplaza por HomeView, solo confirma que el login redirige correctamente */
function showHome() {
  authContainer.innerHTML = `
    <section>
      <h2>Welcome back!</h2>
      <p>Login successful. (Home page pending — pages/home)</p>
    </section>
  `;
}

function showRegister() {
  authContainer.innerHTML = RegisterView();

  initRegisterView(() => showLogin("Account created! Please log in."));

  document.getElementById("go-login").addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });
}

showLogin();
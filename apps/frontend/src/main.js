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

function showLogin() {
  authContainer.innerHTML = LoginView();

  initLoginView();

  document.getElementById("go-register").addEventListener("click", (e) => {
    e.preventDefault();
    showRegister();
  });
}

function showRegister() {
  authContainer.innerHTML = RegisterView();

  initRegisterView();

  document.getElementById("go-login").addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });
}

showLogin();
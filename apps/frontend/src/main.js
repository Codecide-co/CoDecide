import "@/styles/index.css";

import { viewHeroLogin } from "./pages/auth/hero.view";
import { LoginView, initLoginView } from "./pages/auth/login.view";
import { RegisterView, initRegisterView } from "./pages/auth/register.view";
import { CreateReportView, initCreateReportView } from "./pages/reports/create";

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

/* Reemplaza por HomeView real, solo confirma que el login redirige correctamente */
function showHome() {
  authContainer.innerHTML = `
    <section>
      <h2>Welcome back!</h2>
      <p>Login successful. (Home page pending — pages/home)</p>
      <button id="go-create-report" type="button">New report</button>
    </section>
  `;

  document.getElementById("go-create-report").addEventListener("click", showCreateReport);
}

function showCreateReport() {
  authContainer.innerHTML = CreateReportView();
  initCreateReportView(showReportDetail);
}

function showReportDetail(report) {
  authContainer.innerHTML = `
    <section>
      <h2>Report submitted</h2>
      <p><strong>Title:</strong> <span id="detail-title"></span></p>
      <p><strong>Category:</strong> <span id="detail-category"></span></p>
      <p><strong>Anonymous:</strong> <span id="detail-anonymous"></span></p>
      <p id="detail-description"></p>
      <button id="back-home" type="button">Back to home</button>
    </section>
  `;

  // textContent, no innerHTML: el título/descripción vienen del usuario.
  document.getElementById("detail-title").textContent = report.title;
  document.getElementById("detail-category").textContent = report.category;
  document.getElementById("detail-anonymous").textContent = report.anonymous ? "Yes" : "No";
  document.getElementById("detail-description").textContent = report.description;

  document.getElementById("back-home").addEventListener("click", showHome);
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
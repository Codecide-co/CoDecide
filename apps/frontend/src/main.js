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
  console.log("Mostrando register");
  authContainer.innerHTML = RegisterView();

  initRegisterView();
  console.log("bendito error")

  document.getElementById("go-login").addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });
}

showLogin();

// app.innerHTML = `
//   <main>
//     <h1 id="welcome" class="welcome">
//       Welcome <span id="member-name" class="member-name"></span> to initial CokeDecide
//     </h1>

//     <div>
//       <button id="click-me" class="click-me">Click me</button>
//     </div>

//   </main>
// `

// document.addEventListener('DOMContentLoaded', () => {

//   const clickMeButton = document.getElementById('click-me');
//   const memberNameSpan = document.getElementById('member-name');
//   const members = ['Gustavo', 'Mari', 'Andrea', 'Brandon', 'Carlos', 'Juan'];

//   memberNameSpan.textContent = members[Math.floor(Math.random() * members.length)];

//   clickMeButton.addEventListener('click', () => {
//     memberNameSpan.textContent = members[Math.floor(Math.random() * members.length)];
//   });
// });

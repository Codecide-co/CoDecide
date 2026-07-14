import { authStore, logout as doLogout } from "@store/auth.store";
import { navigateTo } from "@router/index";

export default function homeView() {
  const user = authStore.user;

  setTimeout(() => {
    document.getElementById("logout-btn")?.addEventListener("click", () => {
      doLogout();
      navigateTo("/");
    });
  }, 0);

  return `
    <div class="min-h-screen bg-slate-100">
      <header class="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold">CokeDecide</h1>
        <div class="flex items-center gap-4">
          <span class="text-slate-600">${user?.name || "User"}</span>
          <button id="logout-btn" class="text-sm text-red-600 hover:underline">Logout</button>
        </div>
      </header>
      <main class="max-w-4xl mx-auto p-6">
        <h2 class="text-2xl font-semibold mb-4">Welcome, ${user?.name || "User"}</h2>
        <p class="text-slate-500">You are logged in. More content coming soon.</p>
      </main>
    </div>
  `;
}

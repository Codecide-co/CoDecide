import { navigateTo } from "@core/helpers";

export function NotFoundPageView() {
  setTimeout(() => {
    document.getElementById("back-home")?.addEventListener("click", () => navigateTo("/home"));
  }, 0);

  return `
    <div class="min-h-screen flex items-center justify-center bg-slate-100">
      <div class="text-center bg-white rounded-xl shadow p-10 max-w-sm">
        <h1 class="text-6xl font-bold text-slate-300 mb-4">404</h1>
        <p class="text-slate-500 mb-6">Page not found</p>
        <button id="back-home" class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          Go home
        </button>
      </div>
    </div>
  `;
}

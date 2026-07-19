import { navigateTo } from "@core/helpers";

export function AccessDeniedPageView() {
  setTimeout(() => {
    document.getElementById("backHome")?.addEventListener("click", () => navigateTo("/home"));
  }, 0);

  return `
    <div class="min-h-screen flex flex-col items-center justify-center bg-slate-100 gap-4">
      <div class="bg-white rounded-xl shadow p-10 text-center max-w-sm">
        <p class="text-5xl mb-4"><i class="fa-solid fa-ban text-red-600"></i></p>
        <h2 class="text-2xl font-bold text-red-600 mb-2">Access denied</h2>
        <p class="text-slate-500 mb-6">You do not have permission to access this section.</p>
        <button id="backHome" class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          Back to home
        </button>
      </div>
    </div>
  `;
}

import { navigateTo } from "@core/helpers";

export function NotFoundPageView() {
  setTimeout(() => {
    document.getElementById("back-home")?.addEventListener("click", () => navigateTo("/home"));
  }, 0);

  return `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 px-4">
      <div class="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 sm:p-16 w-full max-w-xl">
        <h1 class="text-8xl sm:text-9xl font-bold text-slate-300 mb-2 leading-none">404</h1>
        <p class="text-slate-400 text-sm sm:text-base uppercase tracking-widest mb-2">Error</p>
        <p class="text-slate-500 text-lg sm:text-xl mb-8">Page not found</p>
        <p class="text-slate-400 text-sm sm:text-base mb-8 max-w-sm mx-auto">The page you are looking for does not exist or has been moved.</p>
        <button id="back-home" class="bg-blue-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-blue-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          Go home
        </button>
      </div>
    </div>
  `;
}

import { navigateTo } from "@core/helpers";

export function NotFoundPageView() {
  setTimeout(() => {
    document.getElementById("back-home")?.addEventListener("click", () => navigateTo("/home"));
  }, 0);

  return `
    <div class="w-full min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-blue-50 px-4 py-8">
      <div class="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-10 sm:p-12 w-full max-w-lg">
        <i class="fa-solid fa-triangle-exclamation text-4xl sm:text-5xl text-slate-300 mb-4"></i>
        <h1 class="text-8xl sm:text-9xl font-bold text-slate-300 mb-2 leading-none select-none">404</h1>
        <p class="text-slate-400 text-xs sm:text-sm uppercase tracking-[0.2em] mb-2">Error</p>
        <p class="text-slate-500 text-xl sm:text-2xl font-semibold mb-4">Page not found</p>
        <p class="text-slate-400 text-sm sm:text-base mb-10 leading-relaxed">The page you are looking for does not exist or has been moved.</p>
        <button
          id="back-home"
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-blue-600 text-white w-full sm:w-auto px-14 py-5 rounded-xl text-lg sm:text-xl font-semibold hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          <i class="fa-solid fa-house"></i>
          Go home
        </button>
      </div>
    </div>
  `;
}
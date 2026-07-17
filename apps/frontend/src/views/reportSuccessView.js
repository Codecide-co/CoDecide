import { navigateTo } from "@router/index";

export default function reportSuccessView() {
  let report = null;
  try {
    const stored = sessionStorage.getItem("lastReport");
    if (stored) report = JSON.parse(stored);
  } catch {
    report = null;
  }

  setTimeout(() => {
    document.getElementById("back-home")?.addEventListener("click", () => {
      sessionStorage.removeItem("lastReport");
      navigateTo("/home");
    });
  }, 0);

  if (!report) {
    return `
      <div class="min-h-screen bg-slate-100 flex items-center justify-center">
        <div class="bg-white rounded-xl shadow p-10 text-center max-w-sm">
          <h2 class="text-2xl font-bold mb-4">Report not found</h2>
          <p class="text-slate-500 mb-6">No recent report submission found.</p>
          <button id="back-home" class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            Back to home
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="min-h-screen bg-slate-100 flex items-center justify-center">
      <div class="bg-white rounded-xl shadow p-10 text-center max-w-lg">
        <h2 class="text-2xl font-bold text-green-600 mb-2">Report submitted</h2>
        <p class="text-slate-500 mb-6">Your report has been received. Here's a summary:</p>
        <div class="text-left space-y-2 mb-6">
          <p><strong>Title:</strong> ${escapeHtml(report.title)}</p>
          <p><strong>Category:</strong> ${escapeHtml(report.category)}</p>
          <p><strong>Anonymous:</strong> ${report.is_anonymous ? "Yes" : "No"}</p>
          <p><strong>Description:</strong> ${escapeHtml(report.description)}</p>
          ${report.photoCount ? `<p><strong>Photos:</strong> ${report.photoCount} file(s)</p>` : ""}
        </div>
        <button id="back-home" class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          Back to home
        </button>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

import { navigateTo, escapeHtml, getRouteState } from "@core/helpers";
import { UPLOADS_BASE } from "@core/api";

export function SuccessPageView() {
  const state = getRouteState();
  const report = state?.report || null;
  const attachments = state?.attachments || [];

  setTimeout(() => {
    document.getElementById("back-home")?.addEventListener("click", () => navigateTo("/home"));
    document.getElementById("view-report")?.addEventListener("click", () => navigateTo(`/reports/${report.id}`));
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

  const photoHtml = attachments.length > 0
    ? `<div class="mt-4"><strong>Photos:</strong><div class="flex gap-2 mt-1 flex-wrap">${attachments.map((a) => `<img src="${UPLOADS_BASE}${escapeHtml(a.file_url)}" alt="${escapeHtml(a.file_name)}" class="w-20 h-20 object-cover rounded border">`).join("")}</div></div>`
    : "";

  return `
    <div class="min-h-screen bg-slate-100 flex items-center justify-center">
      <div class="bg-white rounded-xl shadow p-10 text-center max-w-lg">
        <h2 class="text-2xl font-bold text-green-600 mb-2">Report submitted</h2>
        <p class="text-slate-500 mb-6">Your report has been received. Here's a summary:</p>
        <div class="text-left space-y-2 mb-6">
          <p><strong>Tracking #:</strong> ${escapeHtml(report.tracking_number)}</p>
          <p><strong>Title:</strong> ${escapeHtml(report.title)}</p>
          <p><strong>Category:</strong> ${escapeHtml(report.category_name)}</p>
          <p><strong>Anonymous:</strong> ${report.is_anonymous ? "Yes" : "No"}</p>
          ${report.description ? `<p style="overflow-wrap: break-word; word-break: break-word;"><strong>Description:</strong> ${escapeHtml(report.description)}</p>` : ""}
          ${photoHtml}
        </div>
        <div class="flex gap-3 justify-center">
          <button id="back-home" class="bg-slate-200 text-slate-700 px-5 py-2 rounded-lg hover:bg-slate-300 transition">
            Back to home
          </button>
          <button id="view-report" class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            View report
          </button>
        </div>
      </div>
    </div>
  `;
}

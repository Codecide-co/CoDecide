import { HeaderHome } from "@/layout/Header";
import { SidebarHome } from "@/layout/Sidebar";
import { fetchApiData } from "@utils/api";
import { navigateTo } from "@router/index";
import { authStore } from "@store/auth.store";
import { VotingWidgetView, initVotingWidget } from "@components/domain/VotingWidget";

export default function reportDetailView(reportId) {
  setTimeout(() => {
    fetchApiData(`/reports/${reportId}`)
      .then((report) => {
        const container = document.getElementById("report-detail");
        if (!container) return;

        container.innerHTML = `
          <div class="report-detail-card">
            <div class="report-detail-header">
              <h2 class="report-detail-title">${escapeHtml(report.title)}</h2>
              <span class="home-status-badge ${report.status}">${report.status.replace("_", " ")}</span>
            </div>

            <div class="report-detail-author">
              ${report.is_anonymous
                ? `<span class="anonymous-badge">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                    Anonymous
                    <span class="anonymous-tooltip">The author&#39;s identity is hidden for this report.</span>
                  </span>`
                : `<span class="report-detail-author-name">Posted by ${escapeHtml(report.author_name || "Unknown")}</span>`
              }
              <span class="report-detail-date">${new Date(report.created_at).toLocaleDateString()}</span>
            </div>

            <p class="report-detail-description">${escapeHtml(report.description)}</p>

            <div class="report-detail-meta">
              <span><strong>Category:</strong> ${escapeHtml(report.category_name || "Unknown")}</span>
              <span><strong>Tracking:</strong> #${report.tracking_number || report.id}</span>
            </div>

            ${report.attachments && report.attachments.length > 0 ? `
            <div class="report-detail-attachments">
              <h4>Attachments (${report.attachments.length})</h4>
              <div class="report-detail-attachment-grid">
                ${report.attachments.map(a => `
                  <div class="report-detail-attachment-item">
                    ${a.file_path?.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)
                      ? `<img src="${a.file_path}" alt="Attachment">`
                      : `<span>${a.file_name || "File"}</span>`
                    }
                  </div>
                `).join("")}
              </div>
            </div>` : ""}

            <div class="report-detail-stats">
              ${VotingWidgetView({ reportId: report.id, upvotes: report.upvotes || 0, downvotes: report.downvotes || 0, userVote: report.user_vote, isOwnReport: authStore.user?.id === report.user_id })}
              <span>${report.comments_count || 0} comments</span>
            </div>

            ${report.comments && report.comments.length > 0 ? `
            <div class="report-detail-comments">
              <h4>Comments (${report.comments.length})</h4>
              ${report.comments.map(c => `
                <div class="report-detail-comment">
                  <strong>${escapeHtml(c.author_name || "Anonymous")}</strong>
                  <p>${escapeHtml(c.body)}</p>
                  <small>${new Date(c.created_at).toLocaleDateString()}</small>
                </div>
              `).join("")}
            </div>` : ""}

            <button id="back-to-reports" class="report-detail-back">← Back to Reports</button>
          </div>
        `;

        document.getElementById("back-to-reports")?.addEventListener("click", () => {
          navigateTo("/reports");
        });
        initVotingWidget();
      })
      .catch(() => {
        document.getElementById("report-detail").innerHTML = `
          <div class="report-detail-error">
            <h2>Report not found</h2>
            <p>This report could not be loaded. It may have been removed or you may not have access.</p>
            <button id="back-to-reports" class="report-detail-back">← Back to Reports</button>
          </div>
        `;
        document.getElementById("back-to-reports")?.addEventListener("click", () => {
          navigateTo("/reports");
        });
      });
  }, 0);

  return `
    ${HeaderHome()}
    <div class="auth-layout flex flex-row">
      ${SidebarHome()}
      <main class="container-home">
        <section class="report-detail-page">
          <div id="report-detail">
            <p class="report-detail-loading">Loading report...</p>
          </div>
        </section>
      </main>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

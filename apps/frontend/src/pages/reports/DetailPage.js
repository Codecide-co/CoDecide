import { HeaderHome } from "@/layouts/Header";
import { SidebarHome } from "@/layouts/Sidebar";
import { fetchApiData, postApiData, UPLOADS_BASE } from "@core/api";
import { navigateTo, escapeHtml, formatDate } from "@core/helpers";
import { authStore } from "@store/auth.store";
import { VotingWidgetView, initVotingWidget } from "@components/domain/VotingWidget";
import { voteReport } from "@services/reports.service";
import { t } from "@core/i18n";

function renderReport(report, reportId) {
  return `
    <div class="report-detail-card">
      <div class="report-detail-header">
        <h2 class="report-detail-title">${escapeHtml(report.title)}</h2>
        <span class="home-status-badge ${report.status}">${report.status.replace("_", " ")}</span>
      </div>

      <div class="report-detail-author">
        ${report.is_anonymous
          ? `<span class="anonymous-badge">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
              ${t("home.anonymous_badge")}
              <span class="anonymous-tooltip">${t("home.anonymous_tooltip")}</span>
            </span>`
          : `<span class="report-detail-author-name">${t("report.detail.posted_by")} ${escapeHtml(report.author_name || t("report.detail.unknown_author"))}</span>`
        }
        <span class="report-detail-date">${formatDate(report.created_at, "datetime")}</span>
      </div>

      <p class="report-detail-description">${escapeHtml(report.description)}</p>

      <div class="report-detail-meta">
        <span><strong>${t("report.detail.category")}</strong> ${escapeHtml(report.category_name || "Unknown")}</span>
        <span><strong>${t("report.detail.tracking")}</strong> #${report.tracking_number || report.id}</span>
        ${report.status_history?.length > 0 ? `<span><strong>${t("report.detail.status")}</strong> ${escapeHtml(report.status)}</span>` : ""}
      </div>

      ${report.attachments && report.attachments.length > 0 ? `
      <div class="report-detail-attachments">
        <h4>${t("report.detail.attachments", { count: report.attachments.length })}</h4>
        <div class="report-detail-attachment-grid">
          ${report.attachments.map(a => `
            <div class="report-detail-attachment-item">
              ${a.file_url?.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)
                ? `<a href="${UPLOADS_BASE}${a.file_url}" target="_blank" rel="noopener noreferrer">
                    <img src="${UPLOADS_BASE}${a.file_url}" alt="${a.file_name || t("report.detail.attachment_alt")}" loading="lazy" onerror="this.parentElement.parentElement.innerHTML='<span>${escapeHtml(a.file_name || t("report.detail.file"))}</span>'">
                  </a>`
                : `<span>${a.file_name || t("report.detail.file")}</span>`
              }
            </div>
          `).join("")}
        </div>
      </div>` : ""}

      <div class="report-detail-stats">
        ${VotingWidgetView({ reportId: report.id, upvotes: report.upvotes || 0, downvotes: report.downvotes || 0, userVote: report.user_vote, isOwnReport: report.is_own_report, isAdmin: authStore.user?.role === "admin" })}
        <span id="comments-count">${t("report.detail.comments_count", { count: report.comments_count || 0 })}</span>
      </div>

      ${report.status_history && report.status_history.length > 0 ? `
      <div class="report-detail-status-history">
        <h4>${t("report.detail.status_history")}</h4>
        <div class="status-timeline">
          ${report.status_history.map(h => `
            <div class="status-timeline-item">
              <div class="status-timeline-dot"></div>
              <div class="status-timeline-content">
                <div class="status-timeline-header">
                  <span class="status-timeline-action">${escapeHtml(h.action.replace("_", " "))}</span>
                  <span class="status-timeline-date">${formatDate(h.created_at, "datetime")}</span>
                </div>
                ${h.details ? `
                  <div class="status-timeline-details">
                    ${h.details.from && h.details.to ? `<span class="status-timeline-transition">${escapeHtml(h.details.from)} → ${escapeHtml(h.details.to)}</span>` : ""}
                    ${h.details.comment ? `<p class="status-timeline-comment">${escapeHtml(h.details.comment)}</p>` : ""}
                  </div>
                ` : ""}
              </div>
            </div>
          `).join("")}
        </div>
      </div>` : ""}

      ${report.comments && report.comments.length > 0 ? `
      <div class="report-detail-comments">
        <h4>${t("report.detail.comments_section", { count: report.comments.length })}</h4>
        ${report.comments.map(c => {
          const avatarUrl = c.author_avatar_url ? `${UPLOADS_BASE}${c.author_avatar_url}` : null;
          const initial = (c.author_name || "A")[0].toUpperCase();
          return `
          <div class="report-detail-comment">
            <div class="comment-header">
              <div class="comment-author">
                ${avatarUrl
                  ? `<img src="${avatarUrl}" alt="${escapeHtml(c.author_name || "Anonymous")}" class="comment-avatar" />`
                  : `<span class="comment-avatar comment-avatar-initial">${initial}</span>`
                }
                <strong>${escapeHtml(c.author_name || t("home.anonymous_badge"))}</strong>
              </div>
              <small>${formatDate(c.created_at, "datetime")}</small>
            </div>
            <p>${escapeHtml(c.body)}</p>
          </div>`;
        }).join("")}
      </div>` : ""}

      <div class="report-detail-add-comment">
        <h4>${t("report.detail.add_comment")}</h4>
        <textarea id="comment-body" placeholder="${t("report.detail.comment_placeholder")}" rows="3"></textarea>
        <small id="comment-error"></small>
        <button id="submit-comment" class="report-detail-back">${t("report.detail.submit_comment")}</button>
      </div>

      <button id="back-to-reports" class="report-detail-back">${t("report.detail.back")}</button>
    </div>
  `;
}

function initCommentForm(reportId) {
  const submitBtn = document.getElementById("submit-comment");
  const textarea = document.getElementById("comment-body");
  const errorEl = document.getElementById("comment-error");

  submitBtn?.addEventListener("click", async () => {
    const body = textarea.value.trim();
    if (!body) {
      errorEl.textContent = t("report.detail.comment_empty");
      return;
    }
    errorEl.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = t("report.detail.submitting");

    try {
      await postApiData(`/reports/${reportId}/comments`, { body });
      const detail = await fetchApiData(`/reports/${reportId}`);
      const commentsSection = document.querySelector(".report-detail-comments");
      const countSpan = document.getElementById("comments-count");

      if (countSpan) {
        countSpan.textContent = t("report.detail.comments_count", { count: detail.comments_count || 0 });
      }

      if (detail.comments?.length > 0) {
        const newCommentsHtml = `
          <div class="report-detail-comments">
            <h4>${t("report.detail.comments_section", { count: detail.comments.length })}</h4>
            ${detail.comments.map(c => {
              const avatarUrl = c.author_avatar_url ? `${UPLOADS_BASE}${c.author_avatar_url}` : null;
              const initial = (c.author_name || "A")[0].toUpperCase();
              return `
              <div class="report-detail-comment">
                <div class="comment-header">
                  <div class="comment-author">
                    ${avatarUrl
                      ? `<img src="${avatarUrl}" alt="${escapeHtml(c.author_name || "Anonymous")}" class="comment-avatar" />`
                      : `<span class="comment-avatar comment-avatar-initial">${initial}</span>`
                    }
                <strong>${escapeHtml(c.author_name || t("home.anonymous_badge"))}</strong>
                  </div>
                  <small>${formatDate(c.created_at, "datetime")}</small>
                </div>
                <p>${escapeHtml(c.body)}</p>
              </div>`;
            }).join("")}
          </div>
        `;
        if (commentsSection) {
          commentsSection.outerHTML = newCommentsHtml;
        } else {
          document.querySelector(".report-detail-add-comment").insertAdjacentHTML("beforebegin", newCommentsHtml);
        }
      }

      textarea.value = "";
      submitBtn.disabled = false;
      submitBtn.textContent = t("report.detail.submit_comment");
    } catch (error) {
      errorEl.textContent = error.message || t("report.detail.comment_error");
      submitBtn.disabled = false;
      submitBtn.textContent = t("report.detail.submit_comment");
    }
  });
}

export function DetailPageView(reportId) {
  setTimeout(() => {
    fetchApiData(`/reports/${reportId}`)
      .then((report) => {
        const container = document.getElementById("report-detail");
        if (!container) return;

        container.innerHTML = renderReport(report, reportId);

        initCommentForm(reportId);
        document.getElementById("back-to-reports")?.addEventListener("click", () => {
          navigateTo("/reports");
        });
        initVotingWidget({ onVote: voteReport });
      })
      .catch(() => {
        document.getElementById("report-detail").innerHTML = `
          <div class="report-detail-error">
            <h2>${t("report.detail.not_found")}</h2>
            <p>${t("report.detail.not_found_desc")}</p>
            <button id="back-to-reports" class="report-detail-back">${t("report.detail.back")}</button>
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
      <main class="container-home container-home--report-detail">
        <section class="report-detail-page">
          <div id="report-detail">
            <p class="report-detail-loading">${t("report.detail.loading")}</p>
          </div>
        </section>
      </main>
    </div>
  `;
}

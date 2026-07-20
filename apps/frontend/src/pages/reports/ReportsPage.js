import { HeaderHome } from "@/layouts/Header";
import { SidebarHome } from "@/layouts/Sidebar";
import { fetchApiData, UPLOADS_BASE } from "@core/api";
import { navigateTo, formatDate } from "@core/helpers";
import { authStore } from "@store/auth.store";
import { VotingWidgetView, initVotingWidget } from "@components/domain/VotingWidget";
import { voteReport } from "@services/reports.service";

export function ReportsPageView() {
  return `
    ${HeaderHome()}
    <div class="auth-layout flex flex-row">
      ${SidebarHome()}
        <main class="container-home container-home--reports">
        <section class="reports-page">

          <h2 class="reports-title">All Reports</h2>

          <div class="reports-filter-bar">
            <select id="filter-status">
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select id="filter-category">
              <option value="">All Categories</option>
            </select>
            <input type="date" id="filter-date-from">
            <input type="date" id="filter-date-to">
          </div>

          <div id="reports-grid" class="reports-grid">
            <p class="reports-loading">Loading...</p>
          </div>

          <div id="reports-pagination" class="reports-pagination"></div>

        </section>
      </main>
    </div>
  `;
}

export function initReportsPage() {
  let page = 1;
  let statusFilter = "";
  let categoryFilter = "";
  let dateFrom = "";
  let dateTo = "";
  let categoryNames = {};

  fetchApiData("/categories")
    .then((cats) => {
      const select = document.getElementById("filter-category");
      if (!select) return;
      cats.forEach((c) => {
        categoryNames[c.id] = c.name;
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        select.appendChild(opt);
      });
    })
    .catch(() => {});

  function loadReports() {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("per_page", 12);
    if (statusFilter) params.set("status", statusFilter);
    if (categoryFilter) params.set("category_id", categoryFilter);
    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);

    const grid = document.getElementById("reports-grid");
    const pagination = document.getElementById("reports-pagination");
    if (!grid) return;

    grid.innerHTML = `<p class="reports-loading">Loading...</p>`;

    fetchApiData(`/reports?${params.toString()}`)
      .then((data) => {
        const reports = data.reports || [];
        const totalPages = data.pages || 1;

        if (reports.length === 0) {
          grid.innerHTML = `<p class="reports-loading">No reports found.</p>`;
        } else {
          grid.innerHTML = reports
            .map(
              (r) => `
              <div class="report-card" data-id="${r.id}">
                <div class="report-card-img report-card-img--loading">
                  <img src="/img.svg">
                </div>
                <div class="report-card-header">
                  <span class="report-card-title">${r.title}</span>
                  <span class="home-status-badge ${r.status}">${r.status.replace("_", " ")}</span>
                </div>
                <div class="report-card-meta">
                  <span>${categoryNames[r.category_id] || "Unknown"}</span>
                  <span>${formatDate(r.created_at)}</span>
                </div>
                <div class="report-card-footer">
                  ${VotingWidgetView({ reportId: r.id, upvotes: r.upvotes || 0, downvotes: r.downvotes || 0, userVote: r.user_vote, isOwnReport: r.is_own_report, isAdmin: authStore.user?.role === "admin" })}
                  <span>${r.comments_count || 0} comments</span>
                  ${r.is_anonymous ? `
                  <span class="anonymous-badge">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                    Anonymous
                    <span class="anonymous-tooltip">The author&#39;s identity is hidden for this report.</span>
                  </span>` : ""}
                </div>
              </div>
            `
            )
            .join("");

          reports.forEach((r) => {
            fetchApiData(`/reports/${r.id}`)
              .then((detail) => {
                const card = document.querySelector(`.report-card[data-id="${r.id}"]`);
                if (!card) return;
                const imgContainer = card.querySelector(".report-card-img");
                if (!imgContainer) return;

                if (detail.attachments?.[0]?.file_url) {
                  imgContainer.innerHTML = `<img src="${UPLOADS_BASE}${detail.attachments[0].file_url}" alt="" loading="lazy" onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('report-card-img--broken')">`;
                } else {
                  imgContainer.classList.remove("report-card-img--loading");
                  imgContainer.classList.add("report-card-img--placeholder");
                  imgContainer.innerHTML = `
                    <img src="/img.svg">
                    <span>No image</span>
                  `;
                }
              })
              .catch(() => {});
          });

          document.querySelectorAll(".report-card").forEach((card) => {
            card.addEventListener("click", () => {
              navigateTo(`/reports/${card.dataset.id}`);
            });
          });
          initVotingWidget({ onVote: voteReport });
        }

        pagination.innerHTML = `
          <button id="prev-page" ${page <= 1 ? "disabled" : ""}>← Previous</button>
          <span>Page ${page} of ${totalPages}</span>
          <button id="next-page" ${page >= totalPages ? "disabled" : ""}>Next →</button>
        `;

        document.getElementById("prev-page")?.addEventListener("click", () => {
          if (page > 1) { page--; loadReports(); }
        });
        document.getElementById("next-page")?.addEventListener("click", () => {
          if (page < totalPages) { page++; loadReports(); }
        });
      })
      .catch(() => {
        grid.innerHTML = `<p class="reports-loading">Could not load reports.</p>`;
      });
  }

  loadReports();

  document.getElementById("filter-status")?.addEventListener("change", (e) => {
    statusFilter = e.target.value;
    page = 1;
    loadReports();
  });

  document.getElementById("filter-category")?.addEventListener("change", (e) => {
    categoryFilter = e.target.value;
    page = 1;
    loadReports();
  });

  document.getElementById("filter-date-from")?.addEventListener("change", (e) => {
    dateFrom = e.target.value;
    page = 1;
    loadReports();
  });

  document.getElementById("filter-date-to")?.addEventListener("change", (e) => {
    dateTo = e.target.value;
    page = 1;
    loadReports();
  });
}

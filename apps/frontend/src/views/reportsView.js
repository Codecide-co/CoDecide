import { HeaderHome } from "@/layout/Header";
import { SidebarHome } from "@/layout/Sidebar";
import { fetchApiData } from "@utils/api";
import { navigateTo } from "@router/index";

export default function reportsView() {
  let page = 1;
  let statusFilter = "";
  let categoryFilter = "";
  let categoryNames = {};

  setTimeout(() => {
    // --- LOAD CATEGORIES ---
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

    // --- LOAD REPORTS ---
    function loadReports() {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("per_page", 12);
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter) params.set("category_id", categoryFilter);

      const grid = document.getElementById("reports-grid");
      const pagination = document.getElementById("reports-pagination");
      if (!grid) return;

      grid.innerHTML = `<p class="reports-loading">Loading...</p>`;

      fetchApiData(`/reports?${params.toString()}`)
        .then((data) => {
          const reports = data.reports || [];
          const totalPages = data.pages || 1;

          // --- GRID ---
          if (reports.length === 0) {
            grid.innerHTML = `<p class="reports-loading">No reports found.</p>`;
          } else {
            grid.innerHTML = reports
              .map(
                (r) => `
              <div class="report-card" data-id="${r.id}">
                <div class="report-card-header">
                  <span class="report-card-title">${r.title}</span>
                  <span class="home-status-badge ${r.status}">${r.status.replace("_", " ")}</span>
                </div>
                <div class="report-card-meta">
                  <span>${categoryNames[r.category_id] || "Unknown"}</span>
                  <span>${new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <div class="report-card-footer">
                  <span> ${r.votes_count || 0}</span>
                  <span> ${r.comments_count || 0}</span>
                </div>
              </div>
            `
              )
              .join("");

            document.querySelectorAll(".report-card").forEach((card) => {
              card.addEventListener("click", () => {
                navigateTo(`/reports/${card.dataset.id}`);
              });
            });
          }

          // --- PAGINATION ---
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

    // --- FILTER EVENTS ---
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
  }, 0);

  return `
    ${HeaderHome()}
    <div class="auth-layout flex flex-row">
      ${SidebarHome()}
      <main class="container-home">
        <section class="reports-page">

          <h2 class="reports-title">All Reports</h2>

          <!-- FILTERS -->
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
          </div>

          <div id="reports-grid" class="reports-grid">
            <p class="reports-loading">Loading...</p>
          </div>

          <!-- PAGINATION -->
          <div id="reports-pagination" class="reports-pagination"></div>

        </section>
      </main>
    </div>
  `;
}
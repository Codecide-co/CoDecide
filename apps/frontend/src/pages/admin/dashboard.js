import { fetchApiData } from "@utils/api";
import { fetchReports, updateReportStatus } from "@services/reports.service";
import { StatCard } from "@components/domain/StatCard";
import { FilterBar, initFilterBar } from "@components/ui/FilterBar";
import { DataTable, initDataTable } from "@components/ui/DataTable";
import { Pagination, initPagination } from "@components/ui/Pagination";
import { StatusModal } from "@components/ui/StatusDropdown";
import { HeaderHome } from "@/layout/Header";
import { SidebarHome } from "@/layout/Sidebar";
import { createAnnouncement } from "@services/announcements.service";

let currentPage = 1;
let currentStatus = "";
let currentCategory = "";
let totalPages = 1;
let categories = [];

function loadDashboard() {
  const statsContainer = document.getElementById("admin-stats");
  const tableContainer = document.getElementById("admin-table");
  const paginationContainer = document.getElementById("admin-pagination");

  fetchApiData("/stats")
    .then((stats) => {
      statsContainer.innerHTML = `
        <div class="admin-stats-grid">
          ${StatCard({ label: "Total Reports", value: stats.total_reports ?? "—", color: "#2563EB" })}
          ${StatCard({ label: "Open", value: stats.by_status?.open ?? "—", color: "#F59E0B" })}
          ${StatCard({ label: "In Progress", value: stats.by_status?.in_progress ?? "—", color: "#8B5CF6" })}
          ${StatCard({ label: "Resolved Today", value: stats.resolved_today ?? "—", color: "#22C55E" })}
        </div>
      `;
    })
    .catch(() => {
      statsContainer.innerHTML = `<p style="color: #EF4444;">Failed to load stats.</p>`;
    });

  fetchReports({
    page: currentPage,
    per_page: 15,
    status: currentStatus,
    category_id: currentCategory,
  })
    .then((data) => {
      const reports = data.reports || [];
      totalPages = data.pages || 1;

      tableContainer.innerHTML = DataTable({ reports, categories });
      initDataTable({ onStatusChange: handleStatusChange });

      paginationContainer.innerHTML = Pagination({ page: currentPage, totalPages });
      initPagination({
        page: currentPage,
        totalPages,
        onPrev: () => { currentPage--; loadDashboard(); },
        onNext: () => { currentPage++; loadDashboard(); },
      });
    })
    .catch(() => {
      tableContainer.innerHTML = `<p style="color: #EF4444; text-align: center;">Failed to load reports.</p>`;
    });
}

async function handleStatusChange(reportId, newStatus, selectEl) {
  const comment = await StatusModal({ reportId, newStatus });
  if (comment === null) {
    selectEl.value = selectEl.dataset.currentStatus;
    return;
  }
  try {
    await updateReportStatus(reportId, newStatus, comment);
    selectEl.dataset.currentStatus = newStatus;
    loadDashboard();
  } catch (error) {
    selectEl.value = selectEl.dataset.currentStatus;
    alert("Error: " + error.message);
  }
}

function showAnnouncementModal() {
  const overlay = document.createElement("div");
  overlay.className = "admin-modal-overlay";
  overlay.innerHTML = `
    <div class="admin-modal">
      <h3>New Announcement</h3>
      <div style="margin: 1rem 0;">
        <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.4rem;">Title</label>
        <input id="ann-title" type="text" placeholder="Announcement title" style="
          width: 100%; padding: 0.75rem; border: 2px solid #E2E8F0;
          border-radius: 8px; font-size: 0.9rem; margin-bottom: 1rem;
        ">
        <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.4rem;">Body</label>
        <textarea id="ann-body" rows="4" placeholder="Write your announcement..." style="
          width: 100%; padding: 0.75rem; border: 2px solid #E2E8F0;
          border-radius: 8px; font-size: 0.9rem; resize: vertical;
        "></textarea>
      </div>
      <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
        <button id="ann-cancel" style="
          padding: 8px 20px; border: 1px solid #E2E8F0; border-radius: 8px;
          background: white; cursor: pointer; font-weight: 600;
        ">Cancel</button>
        <button id="ann-submit" style="
          padding: 8px 20px; border: none; border-radius: 8px;
          background: #2563EB; color: white; cursor: pointer; font-weight: 600;
        ">Publish</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector("#ann-cancel").addEventListener("click", () => overlay.remove());
  overlay.querySelector("#ann-submit").addEventListener("click", async () => {
    const title = overlay.querySelector("#ann-title").value.trim();
    const body = overlay.querySelector("#ann-body").value.trim();
    if (!title || !body) {
      alert("Title and body are required.");
      return;
    }
    try {
      await createAnnouncement(title, body);
      overlay.remove();
      alert("Announcement published!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

export function AdminDashboardView() {
  setTimeout(() => {
    fetchApiData("/categories")
      .then((cats) => {
        categories = cats;
        initFilterBar({
          categories,
          onFilterChange: () => {
            currentStatus = document.getElementById("filter-status").value;
            currentCategory = document.getElementById("filter-category").value;
            currentPage = 1;
            loadDashboard();
          },
        });
      })
      .catch(() => {});

    loadDashboard();

    document.getElementById("btn-new-announcement")?.addEventListener("click", showAnnouncementModal);
  }, 0);

  return `
    ${HeaderHome()}
    <div class="auth-layout flex flex-row">
      ${SidebarHome()}
      <main class="container-home">
        <div class="admin-page">
          <div class="admin-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h2>Admin Dashboard</h2>
              <p>Manage community reports and monitor key metrics</p>
            </div>
            <button id="btn-new-announcement" style="
              padding: 10px 24px; border: none; border-radius: 10px;
              background: linear-gradient(135deg, #2563EB, #60A5FA);
              color: white; font-weight: 700; font-size: 0.9rem;
              cursor: pointer; box-shadow: 0 4px 15px rgba(37,99,235,0.3);
            ">+ New Announcement</button>
          </div>

          <div id="admin-stats">
            <p style="text-align: center; color: #94A3B8; padding: 2rem;">Loading stats...</p>
          </div>

          <div class="admin-section">
            <div id="admin-filters">
              ${FilterBar({})}
            </div>
          </div>

          <div class="admin-section">
            <div id="admin-table">
              <p style="text-align: center; color: #94A3B8; padding: 2rem;">Loading reports...</p>
            </div>
            <div id="admin-pagination"></div>
          </div>
        </div>
      </main>
    </div>
  `;
}
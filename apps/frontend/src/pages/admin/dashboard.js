import { fetchApiData } from "@utils/api";
import { fetchReports } from "@services/reports.service";
import { StatCard } from "@components/domain/StatCard";
import { FilterBar, initFilterBar } from "@components/ui/FilterBar";
import { DataTable, initDataTable } from "@components/ui/DataTable";
import { Pagination, initPagination } from "@components/ui/Pagination";
import { HeaderHome } from "@/layout/Header";
import { SidebarHome } from "@/layout/Sidebar";
import { showStatusChangeModal, showHistoryModal, showAnnouncementModal, showCategoryModal } from "./modals";

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
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          ${StatCard({ label: "Total Reports", value: stats.total_reports ?? "—", color: "#2563EB" })}
          ${StatCard({ label: "Open", value: stats.by_status?.open ?? "—", color: "#F59E0B" })}
          ${StatCard({ label: "In Progress", value: stats.by_status?.in_progress ?? "—", color: "#8B5CF6" })}
          ${StatCard({ label: "Resolved Today", value: stats.resolved_today ?? "—", color: "#22C55E" })}
        </div>
      `;
    })
    .catch(() => {
      statsContainer.innerHTML = `<p class="text-center p-8">Failed to load stats.</p>`;
    });

  fetchReports({ page: currentPage, per_page: 6, status: currentStatus, category_id: currentCategory })
    .then((data) => {
      const reports = data.reports || [];
      totalPages = data.pages || 1;

      tableContainer.innerHTML = DataTable({ reports, categories });
      initDataTable({
        onStatusChange: (reportId, newStatus) => showStatusChangeModal(reportId, newStatus, loadDashboard),
        onViewHistory: showHistoryModal,
      });

      paginationContainer.innerHTML = Pagination({ page: currentPage, totalPages });
      initPagination({
        page: currentPage, totalPages,
        onPrev: () => { currentPage--; loadDashboard(); },
        onNext: () => { currentPage++; loadDashboard(); },
      });
    })
    .catch(() => {
      tableContainer.innerHTML = `<p class="text-center p-8">Failed to load reports.</p>`;
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
    document.getElementById("btn-new-category")?.addEventListener("click", () => showCategoryModal((cats) => { categories = cats; loadDashboard(); }));
  }, 0);

  return `
    ${HeaderHome()}
    <div class="auth-layout flex flex-row">
      ${SidebarHome()}
      <main class="container-home">
        <div class="admin-page">
          <div class="flex items-center justify-between">
            <div>
              <h2>Admin Dashboard</h2>
              <p>Manage community reports and monitor key metrics</p>
            </div>
            <div class="flex items-center gap-3">
              <button id="btn-new-category" class="admin-btn">+ New Category</button>
              <button id="btn-new-announcement" class="admin-btn">+ New Announcement</button>
            </div>
          </div>
          <div id="admin-stats"><p class="text-center p-8">Loading stats...</p></div>
          <div class="admin-section">
            <div id="admin-filters">${FilterBar({})}</div>
          </div>
          <div class="admin-section">
            <div id="admin-table"><p class="text-center p-8">Loading reports...</p></div>
            <div id="admin-pagination"></div>
          </div>
        </div>
      </main>
    </div>
  `;
}
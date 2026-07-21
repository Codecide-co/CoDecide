import { fetchApiData } from "@core/api";
import { fetchReports } from "@services/reports.service";
import { StatCard } from "@components/domain/StatCard";
import { FilterBar, initFilterBar } from "@components/ui/FilterBar";
import { DataTable, initDataTable } from "@components/ui/DataTable";
import { Pagination, initPagination } from "@components/ui/Pagination";
import { HeaderHome } from "@/layouts/Header";
import { SidebarHome } from "@/layouts/Sidebar";
import { showStatusChangeModal, showHistoryModal, showAnnouncementModal, showCategoryModal } from "./modals";
import { t } from "@core/i18n";

const validTransitions = {
  open: ["in_progress"],
  in_progress: ["resolved"],
  resolved: [],
};

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
          ${StatCard({ label: t("admin.total_reports"), value: stats.total_reports ?? "—", color: "#2563EB" })}
          ${StatCard({ label: t("admin.open"), value: stats.by_status?.open ?? "—", color: "#F59E0B" })}
          ${StatCard({ label: t("admin.in_progress"), value: stats.by_status?.in_progress ?? "—", color: "#8B5CF6" })}
          ${StatCard({ label: t("admin.resolved_today"), value: stats.resolved_today ?? "—", color: "#22C55E" })}
        </div>
      `;
    })
    .catch(() => {
      statsContainer.innerHTML = `<p class="admin-error-badge">${t("admin.stats_error")}</p>`;
    });

  fetchReports({ page: currentPage, per_page: 6, status: currentStatus, category_id: currentCategory })
    .then((data) => {
      const reports = data.reports || [];
      totalPages = data.pages || 1;

      tableContainer.innerHTML = DataTable({ reports, categories, validTransitions });
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
      tableContainer.innerHTML = `<p class="admin-error-badge">${t("admin.reports_error")}</p>`;
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
      <main class="container-home container-home--admin">
        <div class="admin-page">
          <div class="flex items-center justify-between">
            <div>
              <h2>${t("admin.dashboard")}</h2>
              <p>${t("admin.subtitle")}</p>
            </div>
            <div class="flex items-center gap-3 flex-wrap">
              <button id="btn-new-category" class="admin-btn">${t("admin.new_category")}</button>
              <button id="btn-new-announcement" class="admin-btn">${t("admin.new_announcement")}</button>
            </div>
          </div>
          <div id="admin-stats"><p class="text-center p-8">${t("admin.stats_loading")}</p></div>
          <div class="admin-section">
            <div id="admin-filters">${FilterBar({})}</div>
          </div>
          <div class="admin-section">
            <div id="admin-table"><p class="text-center p-8">${t("admin.reports_loading")}</p></div>
            <div id="admin-pagination"></div>
          </div>
        </div>
      </main>
    </div>
  `;
}
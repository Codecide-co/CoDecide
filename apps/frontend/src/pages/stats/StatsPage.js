import { HeaderHome } from "@/layouts/Header";
import { SidebarHome } from "@/layouts/Sidebar";
import { fetchCommunityStats, fetchReportsOverTime, fetchTopVotedReports } from "@services/stats.service";
import { getCategories } from "@services/categories.service";
import { destroyAll } from "@components/charts/chartRegistry";
import { StatCards } from "@components/charts/StatCards";
import { PieChart } from "@components/charts/PieChart";
import { BarChart } from "@components/charts/BarChart";
import { LineChart } from "@components/charts/LineChart";
import { ResolutionTable, TopVotedTable } from "@components/charts/DataTables";

let refreshInterval = null;

export function StatsPageView() {
  setTimeout(() => {
    clearInterval(refreshInterval);
    loadAllStats();
    refreshInterval = setInterval(loadAllStats, 300000);
  }, 0);

  return `
    ${HeaderHome()}
    <div class="auth-layout flex flex-row">
      ${SidebarHome()}
      <main class="container-home container-home--stats">
        <section class="stats-page">
          <h2 class="stats-title">Statistics & Charts</h2>
          <div class="stats-cards" id="stats-cards"></div>
          <div class="stats-charts-grid">
            <div class="stats-chart-card">
              <h3 class="stats-chart-title">Reports by Category</h3>
              <div class="stats-chart-wrapper"><canvas id="chart-pie"></canvas></div>
            </div>
            <div class="stats-chart-card">
              <h3 class="stats-chart-title">Reports by Status</h3>
              <div class="stats-chart-wrapper"><canvas id="chart-bar"></canvas></div>
            </div>
          </div>
          <div class="stats-charts-grid stats-charts-grid--full">
            <div class="stats-chart-card">
              <h3 class="stats-chart-title">Top Voted Reports</h3>
              <div class="stats-table-wrap" id="stats-top-voted"></div>
            </div>
          </div>
          <div class="stats-charts-grid">
            <div class="stats-chart-card">
              <h3 class="stats-chart-title">Avg Resolution Time per Category</h3>
              <div class="stats-table-wrap" id="stats-resolution-table"></div>
            </div>
            <div class="stats-chart-card">
              <h3 class="stats-chart-title">Reports Over Time (30 days)</h3>
              <div class="stats-chart-wrapper"><canvas id="chart-line"></canvas></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `;
}

async function loadAllStats() {
  const container = document.getElementById("stats-cards");
  if (!container) return;

  try {
    const [stats, categories, overTime, topVoted] = await Promise.all([
      fetchCommunityStats(),
      getCategories(),
      fetchReportsOverTime(30),
      fetchTopVotedReports(10),
    ]);

    const catMap = {};
    if (Array.isArray(categories)) {
      categories.forEach((c) => { catMap[String(c.id)] = c.name; });
    }

    destroyAll();
    StatCards({ stats });
    PieChart({ data: stats.by_category, catMap });
    BarChart({ data: stats.by_status });
    LineChart({ data: overTime });
    ResolutionTable({ data: stats.avg_resolution_time_by_category, catMap });
    TopVotedTable({ reports: topVoted });

    const el = document.getElementById("stats-page-error");
    if (el) el.remove();
  } catch {
    container.innerHTML = `<p class="stats-error" id="stats-page-error">Failed to load statistics. Retrying in 5 minutes...</p>`;
  }
}

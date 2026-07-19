import { HeaderHome } from "@/layouts/Header";
import { SidebarHome } from "@/layouts/Sidebar";
import { fetchCommunityStats, fetchReportsOverTime, fetchTopVotedReports } from "@services/stats.service";
import { getCategories } from "@services/categories.service";
import { escapeHtml } from "@core/helpers";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const chartInstances = {};
let refreshInterval = null;

const STATUS_COLORS = {
  open: { bg: "#F59E0B", border: "#D97706" },
  in_progress: { bg: "#2563EB", border: "#1D4ED8" },
  resolved: { bg: "#10B981", border: "#059669" },
  closed: { bg: "#94A3B8", border: "#64748B" },
};

const CATEGORY_PALETTE = [
  "#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16",
];

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
      <main class="container-home">
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
              <h3 class="stats-chart-title">Reports Over Time (30 days)</h3>
              <div class="stats-chart-wrapper"><canvas id="chart-line"></canvas></div>
            </div>
          </div>
          <div class="stats-charts-grid">
            <div class="stats-chart-card">
              <h3 class="stats-chart-title">Avg Resolution Time per Category</h3>
              <div class="stats-table-wrap" id="stats-resolution-table"></div>
            </div>
            <div class="stats-chart-card">
              <h3 class="stats-chart-title">Top Voted Reports</h3>
              <div class="stats-table-wrap" id="stats-top-voted"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `;
}

function destroyChart(key) {
  if (chartInstances[key]) {
    chartInstances[key].destroy();
    delete chartInstances[key];
  }
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

    renderStatCards(stats);
    renderPieChart(stats.by_category, catMap);
    renderBarChart(stats.by_status);
    renderLineChart(overTime);
    renderResolutionTable(stats.avg_resolution_time_by_category, catMap);
    renderTopVoted(topVoted);

    const el = document.getElementById("stats-page-error");
    if (el) el.remove();
  } catch {
    container.innerHTML = `<p class="stats-error" id="stats-page-error">Failed to load statistics. Retrying in 5 minutes...</p>`;
  }
}

function renderStatCards(stats) {
  const container = document.getElementById("stats-cards");
  if (!container) return;
  container.innerHTML = `
    <div class="stat-card"><span class="stat-card-label">Total Reports</span><span class="stat-card-value">${stats.total_reports}</span></div>
    <div class="stat-card"><span class="stat-card-label">Open</span><span class="stat-card-value">${stats.by_status.open}</span></div>
    <div class="stat-card"><span class="stat-card-label">In Progress</span><span class="stat-card-value">${stats.by_status.in_progress}</span></div>
    <div class="stat-card"><span class="stat-card-label">Resolved</span><span class="stat-card-value">${stats.by_status.resolved}</span></div>
    <div class="stat-card"><span class="stat-card-label">Closed</span><span class="stat-card-value">${stats.by_status.closed}</span></div>
    <div class="stat-card"><span class="stat-card-label">Total Users</span><span class="stat-card-value">${stats.total_users}</span></div>
    <div class="stat-card"><span class="stat-card-label">Total Votes</span><span class="stat-card-value">${stats.total_votes}</span></div>
    <div class="stat-card"><span class="stat-card-label">Avg Resolution</span><span class="stat-card-value">${stats.avg_resolution_time != null ? stats.avg_resolution_time + "h" : "N/A"}</span></div>
  `;
}

function renderPieChart(byCategory, catMap) {
  const canvas = document.getElementById("chart-pie");
  if (!canvas) return;

  destroyChart("pie");

  const entries = Object.entries(byCategory).filter(([, v]) => v > 0);
  if (entries.length === 0) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  chartInstances.pie = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: entries.map(([id]) => catMap[id] || `Category ${id}`),
      datasets: [{
        data: entries.map(([, v]) => v),
        backgroundColor: entries.map((_, i) => CATEGORY_PALETTE[i % CATEGORY_PALETTE.length]),
        borderWidth: 2,
        borderColor: "#ffffff",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 16,
            usePointStyle: true,
            pointStyle: "circle",
            font: { size: 12 },
            color: "#475569",
          },
        },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        duration: 1000,
      },
    },
  });
}

function renderBarChart(byStatus) {
  const canvas = document.getElementById("chart-bar");
  if (!canvas) return;

  destroyChart("bar");

  const statuses = ["open", "in_progress", "resolved", "closed"];
  const labels = statuses.map((s) =>
    s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
  const values = statuses.map((s) => byStatus[s] || 0);

  chartInstances.bar = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Reports",
        data: values,
        backgroundColor: statuses.map((s) => STATUS_COLORS[s].bg),
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1E293B",
          titleColor: "#F8FAFC",
          bodyColor: "#CBD5E1",
          cornerRadius: 8,
          padding: 12,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: "#94A3B8",
            font: { size: 11 },
          },
          grid: {
            color: "rgba(0,0,0,0.06)",
          },
        },
        x: {
          ticks: {
            color: "#64748B",
            font: { size: 11 },
          },
          grid: { display: false },
        },
      },
      animation: {
        duration: 800,
        easing: "easeOutQuart",
      },
    },
  });
}

function renderLineChart(data) {
  const canvas = document.getElementById("chart-line");
  if (!canvas) return;

  destroyChart("line");

  const countMap = {};
  if (data) data.forEach((d) => { countMap[d.date] = d.count; });

  const now = new Date();
  const points = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    points.push({ date: key, count: countMap[key] || 0 });
  }

  const labels = points.map((p) => {
    const parts = p.date.split("-");
    return `${parts[1]}/${parts[2]}`;
  });
  const values = points.map((p) => p.count);

  const gradient = canvas.getContext("2d").createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(37, 99, 235, 0.3)");
  gradient.addColorStop(1, "rgba(37, 99, 235, 0.01)");

  chartInstances.line = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Reports",
        data: values,
        fill: true,
        backgroundColor: gradient,
        borderColor: "#2563EB",
        borderWidth: 2.5,
        pointBackgroundColor: "#2563EB",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        tension: 0.3,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1E293B",
          titleColor: "#F8FAFC",
          bodyColor: "#CBD5E1",
          cornerRadius: 8,
          padding: 12,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: "#94A3B8",
            font: { size: 11 },
          },
          grid: {
            color: "rgba(0,0,0,0.06)",
          },
        },
        x: {
          ticks: {
            color: "#94A3B8",
            font: { size: 10 },
            maxTicksLimit: 10,
          },
          grid: { display: false },
        },
      },
      animation: {
        duration: 1200,
        easing: "easeOutQuart",
      },
    },
  });
}

function renderResolutionTable(byCategory, catMap) {
  const container = document.getElementById("stats-resolution-table");
  if (!container) return;

  if (!byCategory || Object.keys(byCategory).length === 0) {
    container.innerHTML = `<p class="stats-empty">No resolution data available.</p>`;
    return;
  }

  const rows = Object.entries(byCategory)
    .filter(([, v]) => v.avg_hours != null)
    .sort((a, b) => b[1].avg_hours - a[1].avg_hours);

  if (rows.length === 0) {
    container.innerHTML = `<p class="stats-empty">No reports have been resolved yet.</p>`;
    return;
  }

  container.innerHTML = `
    <table class="stats-table">
      <thead>
        <tr><th>Category</th><th>Avg Time (hours)</th></tr>
      </thead>
      <tbody>
        ${rows.map(([catId, v]) => `
          <tr>
            <td>${escapeHtml(catMap[catId] || `Category ${catId}`)}</td>
            <td>${v.avg_hours.toFixed(1)}h</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderTopVoted(reports) {
  const container = document.getElementById("stats-top-voted");
  if (!container) return;

  if (!reports || reports.length === 0) {
    container.innerHTML = `<p class="stats-empty">No votes yet.</p>`;
    return;
  }

  container.innerHTML = `
    <table class="stats-table">
      <thead>
        <tr><th>#</th><th>Title</th><th>Up</th><th>Down</th><th>Total</th></tr>
      </thead>
      <tbody>
        ${reports.map((r, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${escapeHtml(r.title)}</td>
            <td class="stats-vote-up">${r.upvotes}</td>
            <td class="stats-vote-down">${r.downvotes}</td>
            <td><strong>${r.total_votes}</strong></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

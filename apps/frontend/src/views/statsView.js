import { HeaderHome } from "@/layout/Header";
import { SidebarHome } from "@/layout/Sidebar";
import { fetchCommunityStats, fetchReportsOverTime, fetchTopVotedReports } from "@services/stats.service";
import { getCategories } from "@services/categories.service";

const CHART_COLORS = [
  "#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16",
];

let refreshInterval = null;

export default function statsView() {
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
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = rect.width;
  const h = Math.min(w, 320);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.scale(dpr, dpr);

  const entries = Object.entries(byCategory).filter(([, v]) => v > 0);
  if (entries.length === 0) {
    ctx.fillStyle = "#94A3B8";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No data", w / 2, h / 2);
    return;
  }

  const total = entries.reduce((s, [, v]) => s + v, 0);
  const cx = w * 0.35;
  const cy = h / 2;
  const radius = Math.min(cx - 20, cy - 20, 100);
  let startAngle = -Math.PI / 2;

  entries.forEach(([catId, count], i) => {
    const sliceAngle = (count / total) * Math.PI * 2;
    const color = CHART_COLORS[i % CHART_COLORS.length];

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    const midAngle = startAngle + sliceAngle / 2;
    const labelR = radius + 20;
    const lx = cx + Math.cos(midAngle) * labelR;
    const ly = cy + Math.sin(midAngle) * labelR;
    const label = catMap[catId] || `Category ${catId}`;
    const pct = ((count / total) * 100).toFixed(1);
    ctx.fillStyle = "#1E293B";
    ctx.font = "11px sans-serif";
    ctx.textAlign = midAngle > Math.PI / 2 && midAngle < Math.PI * 1.5 ? "right" : "left";
    ctx.fillText(`${label} (${pct}%)`, lx, ly);

    startAngle += sliceAngle;
  });

  // legend
  let ly2 = 20;
  entries.forEach(([catId], i) => {
    const color = CHART_COLORS[i % CHART_COLORS.length];
    const lx2 = w * 0.6;
    ctx.fillStyle = color;
    ctx.fillRect(lx2, ly2 - 6, 12, 12);
    ctx.fillStyle = "#475569";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "left";
    const label = catMap[catId] || `Category ${catId}`;
    ctx.fillText(label, lx2 + 18, ly2 + 4);
    ly2 += 22;
  });
}

function renderBarChart(byStatus) {
  const canvas = document.getElementById("chart-bar");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = rect.width;
  const h = Math.min(w, 320);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.scale(dpr, dpr);

  const statuses = ["open", "in_progress", "resolved", "closed"];
  const labels = statuses.map((s) => s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()));
  const values = statuses.map((s) => byStatus[s] || 0);
  const barColors = ["#F59E0B", "#2563EB", "#10B981", "#94A3B8"];
  const maxVal = Math.max(...values, 1);

  const pad = { top: 20, right: 20, bottom: 50, left: 50 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const barWidth = chartW / labels.length * 0.6;
  const gap = chartW / labels.length;

  // y axis lines + labels
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + chartH - (chartH * i / 4);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    ctx.fillStyle = "#94A3B8";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(Math.round(maxVal * i / 4), pad.left - 8, y + 4);
  }

  // bars
  labels.forEach((label, i) => {
    const x = pad.left + gap * i + (gap - barWidth) / 2;
    const barH = (values[i] / maxVal) * chartH;
    const y = pad.top + chartH - barH;

    ctx.fillStyle = barColors[i];
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
    ctx.fill();

    // value on top
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(values[i], x + barWidth / 2, y - 6);

    // label below
    ctx.fillStyle = "#475569";
    ctx.font = "11px sans-serif";
    ctx.fillText(label, x + barWidth / 2, pad.top + chartH + 18);
  });
}

function renderLineChart(data) {
  const canvas = document.getElementById("chart-line");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = rect.width;
  const h = Math.min(w * 0.5, 300);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.scale(dpr, dpr);

  if (!data || data.length === 0) {
    ctx.fillStyle = "#94A3B8";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No data", w / 2, h / 2);
    return;
  }

  // fill missing dates with 0
  const countMap = {};
  data.forEach((d) => { countMap[d.date] = d.count; });

  const now = new Date();
  const points = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    points.push({ date: key, count: countMap[key] || 0 });
  }

  const values = points.map((p) => p.count);
  const maxVal = Math.max(...values, 1);
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const stepX = chartW / (points.length - 1 || 1);

  // y grid lines
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + chartH - (chartH * i / 4);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    ctx.fillStyle = "#94A3B8";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(Math.round(maxVal * i / 4), pad.left - 8, y + 4);
  }

  // x labels (every 5 days)
  points.forEach((p, i) => {
    if (i % 5 !== 0 && i !== points.length - 1) return;
    const x = pad.left + stepX * i;
    ctx.fillStyle = "#94A3B8";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(p.date.slice(5), x, h - 8);
  });

  // area fill
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + chartH);
  points.forEach((p, i) => {
    const x = pad.left + stepX * i;
    const y = pad.top + chartH - (p.count / maxVal) * chartH;
    ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.left + stepX * (points.length - 1), pad.top + chartH);
  ctx.closePath();
  ctx.fillStyle = "rgba(37, 99, 235, 0.1)";
  ctx.fill();

  // line
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = pad.left + stepX * i;
    const y = pad.top + chartH - (p.count / maxVal) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#2563EB";
  ctx.lineWidth = 2;
  ctx.stroke();

  // dots
  points.forEach((p, i) => {
    const x = pad.left + stepX * i;
    const y = pad.top + chartH - (p.count / maxVal) * chartH;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#2563EB";
    ctx.fill();
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

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

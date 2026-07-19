import { Chart } from "chart.js";
import { registerChart } from "./chartRegistry";

export function LineChart({ data, canvasId = "chart-line" }) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

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

  const chart = new Chart(canvas, {
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
          grid: { color: "rgba(0,0,0,0.06)" },
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
      animation: { duration: 1200, easing: "easeOutQuart" },
    },
  });

  registerChart("line", chart);
}

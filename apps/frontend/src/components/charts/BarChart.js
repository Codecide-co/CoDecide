import { Chart } from "chart.js";
import { registerChart } from "./chartRegistry";

const STATUS_COLORS = {
  open: { bg: "#F59E0B", border: "#D97706" },
  in_progress: { bg: "#2563EB", border: "#1D4ED8" },
  resolved: { bg: "#10B981", border: "#059669" },
  closed: { bg: "#94A3B8", border: "#64748B" },
};

export function BarChart({ data, canvasId = "chart-bar" }) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const statuses = ["open", "in_progress", "resolved", "closed"];
  const labels = statuses.map((s) =>
    s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
  const values = statuses.map((s) => data[s] || 0);

  const chart = new Chart(canvas, {
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
      maintainAspectRatio: false,
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
          ticks: { color: "#64748B", font: { size: 11 } },
          grid: { display: false },
        },
      },
      animation: { duration: 800, easing: "easeOutQuart" },
    },
  });

  registerChart("bar", chart);
}

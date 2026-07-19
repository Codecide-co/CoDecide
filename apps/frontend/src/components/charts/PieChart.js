import { Chart } from "chart.js";
import { registerChart } from "./chartRegistry";

const CATEGORY_PALETTE = [
  "#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16",
];

export function PieChart({ data, catMap, canvasId = "chart-pie" }) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const entries = Object.entries(data).filter(([, v]) => v > 0);
  if (entries.length === 0) {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const chart = new Chart(canvas, {
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
            label(ctx) {
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

  registerChart("pie", chart);
}

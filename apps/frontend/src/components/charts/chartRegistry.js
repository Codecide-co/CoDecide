import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const instances = {};

export function registerChart(key, chart) {
  destroyChart(key);
  instances[key] = chart;
}

export function destroyChart(key) {
  if (instances[key]) {
    instances[key].destroy();
    delete instances[key];
  }
}

export function destroyAll() {
  Object.keys(instances).forEach(destroyChart);
}

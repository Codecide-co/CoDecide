import { t } from "@core/i18n";

export function FilterBar({ onFilterChange }) {
  return `
    <div class="admin-filter-bar">
      <select id="filter-status" class="admin-select">
        <option value="">${t("admin.filter.all_statuses")}</option>
        <option value="open">${t("admin.filter.open")}</option>
        <option value="in_progress">${t("admin.filter.in_progress")}</option>
        <option value="resolved">${t("admin.filter.resolved")}</option>
      </select>
      <select id="filter-category" class="admin-select">
        <option value="">${t("admin.filter.all_categories")}</option>
      </select>
    </div>
  `;
}

export function initFilterBar({ categories, onFilterChange }) {
  const catSelect = document.getElementById("filter-category");
  categories.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    catSelect.appendChild(opt);
  });

  document.getElementById("filter-status")?.addEventListener("change", onFilterChange);
  document.getElementById("filter-category")?.addEventListener("change", onFilterChange);
}
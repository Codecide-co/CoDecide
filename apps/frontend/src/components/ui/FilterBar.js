export function FilterBar({ onFilterChange }) {
  return `
    <div class="admin-filter-bar">
      <select id="filter-status" class="admin-select">
        <option value="">All Statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
      </select>
      <select id="filter-category" class="admin-select">
        <option value="">All Categories</option>
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
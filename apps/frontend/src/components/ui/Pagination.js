import { t } from "@core/i18n";

export function Pagination({ page, totalPages, onPrev, onNext }) {
  return `
    <div class="flex items-center justify-center gap-4 mt-6">
      <button id="btn-prev" ${page <= 1 ? "disabled" : ""}>${t("admin.pagination.prev")}</button>
      <span>${t("admin.pagination.info", { page, total: totalPages })}</span>
      <button id="btn-next" ${page >= totalPages ? "disabled" : ""}>${t("admin.pagination.next")}</button>
    </div>
  `;
}

export function initPagination({ page, totalPages, onPrev, onNext }) {
  document.getElementById("btn-prev")?.addEventListener("click", () => {
    if (page > 1) onPrev();
  });
  document.getElementById("btn-next")?.addEventListener("click", () => {
    if (page < totalPages) onNext();
  });
}
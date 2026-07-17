export function Pagination({ page, totalPages, onPrev, onNext }) {
  return `
    <div class="flex items-center justify-center gap-4 mt-6">
      <button id="btn-prev" ${page <= 1 ? "disabled" : ""}>← Previous</button>
      <span>Page ${page} of ${totalPages}</span>
      <button id="btn-next" ${page >= totalPages ? "disabled" : ""}>Next →</button>
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
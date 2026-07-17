export function Pagination({ page, totalPages, onPrev, onNext }) {
  return `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;
    ">
      <button id="btn-prev" ${
        page <= 1 ? "disabled" : ""
      } style="
        padding: 8px 20px;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        background: ${page <= 1 ? "#F1F5F9" : "white"};
        color: ${page <= 1 ? "#94A3B8" : "#0D1B2A"};
        cursor: ${page <= 1 ? "not-allowed" : "pointer"};
        font-weight: 600;
        font-size: 0.85rem;
      ">← Previous</button>
      <span style="font-size: 0.85rem; color: #64748B;">
        Page ${page} of ${totalPages}
      </span>
      <button id="btn-next" ${
        page >= totalPages ? "disabled" : ""
      } style="
        padding: 8px 20px;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        background: ${page >= totalPages ? "#F1F5F9" : "white"};
        color: ${page >= totalPages ? "#94A3B8" : "#0D1B2A"};
        cursor: ${page >= totalPages ? "not-allowed" : "pointer"};
        font-weight: 600;
        font-size: 0.85rem;
      ">Next →</button>
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
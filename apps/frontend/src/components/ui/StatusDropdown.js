export function StatusModal({ reportId, newStatus }) {
  const modal = document.createElement("div");
  modal.className = "admin-modal-overlay";
  modal.innerHTML = `
    <div class="admin-modal">
      <h3>Change Status</h3>
      <p>Change to: <strong>${newStatus.replace("_", " ")}</strong></p>
      <div style="margin: 1rem 0;">
        <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.4rem;">
          Internal comment (optional)
        </label>
        <textarea id="modal-comment" rows="3" placeholder="Add a note about this change..." style="
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.9rem;
          resize: vertical;
        "></textarea>
      </div>
      <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
        <button id="modal-cancel" style="
          padding: 8px 20px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-weight: 600;
        ">Cancel</button>
        <button id="modal-confirm" style="
          padding: 8px 20px;
          border: none;
          border-radius: 8px;
          background: #2563EB;
          color: white;
          cursor: pointer;
          font-weight: 600;
        ">Update Status</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  return new Promise((resolve) => {
    modal.querySelector("#modal-cancel").addEventListener("click", () => {
      modal.remove();
      resolve(null);
    });
    modal.querySelector("#modal-confirm").addEventListener("click", () => {
      const comment = modal.querySelector("#modal-comment").value.trim();
      modal.remove();
      resolve(comment || null);
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
        resolve(null);
      }
    });
  });
}
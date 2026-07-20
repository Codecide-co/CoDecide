import { formatDate } from "@core/helpers";

export function showAnnouncementModal({ title, body, created_at, author_name }) {
  const dialog = document.createElement("dialog");
  dialog.className = "modal-overlay";
  dialog.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" id="ann-modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="announcement-date" style="margin-bottom:1rem;">
          ${formatDate(created_at, "long")}
        </div>
        <p class="announcement-body">${body}</p>
        <span class="announcement-author">— ${author_name || "Administration"}</span>
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn-primary" id="ann-modal-close-btn">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);
  dialog.showModal();

  const close = () => {
    dialog.close();
    dialog.remove();
  };

  dialog.querySelector("#ann-modal-close")?.addEventListener("click", close);
  dialog.querySelector("#ann-modal-close-btn")?.addEventListener("click", close);
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) close();
  });
}
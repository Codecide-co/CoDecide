const state = { currentDialog: null };

export function openModal({ title, content, onSubmit, submitLabel = "Save", cancellable = true, onCancel }) {
  closeModal();

  const dialog = document.createElement("dialog");
  dialog.className = "modal-overlay";
  dialog.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        ${cancellable ? '<button class="modal-close" id="modal-close">&times;</button>' : ""}
      </div>
      <div class="modal-body">${content}</div>
      <div class="modal-footer">
        ${cancellable ? '<button class="modal-btn modal-btn-cancel" id="modal-cancel">Cancel</button>' : ""}
        <button class="modal-btn modal-btn-primary" id="modal-submit">${submitLabel}</button>
      </div>
      <p id="modal-error" class="modal-error hidden"></p>
    </div>
  `;

  document.body.appendChild(dialog);
  dialog.showModal();
  state.currentDialog = dialog;

  const cancelModal = () => {
    if (onCancel) onCancel();
    closeModal();
  };

  dialog.querySelector("#modal-close")?.addEventListener("click", cancelModal);
  dialog.querySelector("#modal-cancel")?.addEventListener("click", cancelModal);
  dialog.addEventListener("click", (e) => { if (e.target === dialog && cancellable) cancelModal(); });

  const submitBtn = dialog.querySelector("#modal-submit");
  const errorEl = dialog.querySelector("#modal-error");

  if (onSubmit) {
    submitBtn.addEventListener("click", async () => {
      submitBtn.disabled = true;
      submitBtn.textContent = "Saving...";
      errorEl.classList.add("hidden");
      try {
        const form = dialog.querySelector("form");
        const data = form ? Object.fromEntries(new FormData(form).entries()) : {};
        await onSubmit(data);
        closeModal();
      } catch (err) {
        errorEl.textContent = err.message || "Something went wrong";
        errorEl.classList.remove("hidden");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      }
    });
  }

  return dialog;
}

export function closeModal() {
  if (state.currentDialog) {
    state.currentDialog.close();
    state.currentDialog.remove();
    state.currentDialog = null;
  }
}
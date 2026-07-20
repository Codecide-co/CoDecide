import { UPLOADS_BASE } from "@core/api";
import { patchApiData, postFormData } from "@core/api";

const AVATARS_PER_PAGE = 30;
const TOTAL_AVATARS = 150;

let currentPage = 1;
let selectedUrl = null;
let currentTab = "gallery";
let uploadFile = null;
let dialog = null;
let onSaveCallback = null;

export function openAvatarModal({ currentAvatarUrl, onSave }) {
  closeAvatarModal();
  onSaveCallback = onSave;
  selectedUrl = currentAvatarUrl || null;
  currentPage = 1;
  currentTab = "gallery";
  uploadFile = null;

  dialog = document.createElement("dialog");
  dialog.className = "modal-overlay";
  document.body.appendChild(dialog);
  render();
  dialog.showModal();

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) closeAvatarModal();
  });
}

function closeAvatarModal() {
  if (dialog) {
    dialog.close();
    dialog.remove();
    dialog = null;
  }
  onSaveCallback = null;
  selectedUrl = null;
  uploadFile = null;
}

function render() {
  dialog.innerHTML = `
    <div class="avatar-modal-content">
      <div class="avatar-modal-header">
        <h3 class="avatar-modal-title">Change profile picture</h3>
        <button class="modal-close" id="avatar-modal-close">&times;</button>
      </div>
      <div class="avatar-modal-tabs">
        <button class="avatar-tab ${currentTab === "gallery" ? "active" : ""}" data-tab="gallery">Gallery</button>
        <button class="avatar-tab ${currentTab === "upload" ? "active" : ""}" data-tab="upload">Upload</button>
      </div>
      <div class="avatar-modal-body">
        ${currentTab === "gallery" ? renderGallery() : renderUpload()}
      </div>
      <div class="avatar-modal-preview">
        ${selectedUrl ? `<img src="${UPLOADS_BASE}${selectedUrl}" alt="Preview" class="avatar-preview-img" />` : '<div class="avatar-preview-empty">No avatar selected</div>'}
      </div>
      <p id="avatar-modal-error" class="modal-error hidden"></p>
      <div class="avatar-modal-footer">
        <button class="modal-btn modal-btn-cancel" id="avatar-modal-cancel">Cancel</button>
        <button class="modal-btn modal-btn-primary" id="avatar-modal-save" ${canSave() ? "" : "disabled"}>Save</button>
      </div>
    </div>
  `;

  bindEvents();
}

function renderGallery() {
  const start = (currentPage - 1) * AVATARS_PER_PAGE;
  const end = Math.min(start + AVATARS_PER_PAGE, TOTAL_AVATARS);
  const totalPages = Math.ceil(TOTAL_AVATARS / AVATARS_PER_PAGE);

  let grid = "";
  for (let i = start + 1; i <= end; i++) {
    const url = `/static/avatars/avatar${i}.svg`;
    const isSelected = selectedUrl === url;
    grid += `
      <div class="avatar-grid-item ${isSelected ? "selected" : ""}" data-avatar-url="${url}">
        <img src="${UPLOADS_BASE}${url}" alt="Avatar ${i}" />
      </div>
    `;
  }

  return `
    <div class="avatar-gallery-grid">${grid}</div>
    <div class="avatar-gallery-pagination">
      <button class="avatar-page-btn" id="avatar-page-prev" ${currentPage <= 1 ? "disabled" : ""}>&larr; Previous</button>
      <span class="avatar-page-info">${currentPage} / ${totalPages}</span>
      <button class="avatar-page-btn" id="avatar-page-next" ${currentPage >= totalPages ? "disabled" : ""}>Next &rarr;</button>
    </div>
  `;
}

function renderUpload() {
  return `
    <div class="avatar-upload-area">
      <label for="avatar-file-input" class="avatar-upload-label">
        ${uploadFile
          ? `<img src="${URL.createObjectURL(uploadFile)}" alt="Upload preview" class="avatar-upload-preview" />`
          : `<div class="avatar-upload-placeholder">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="avatar-upload-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span>Click to upload</span>
              <span class="avatar-upload-hint">PNG, JPG, JPEG, SVG, GIF</span>
            </div>`}
      </label>
      <input type="file" id="avatar-file-input" accept=".png,.jpg,.jpeg,.svg,.gif" hidden />
    </div>
  `;
}

function bindEvents() {
  document.getElementById("avatar-modal-close")?.addEventListener("click", closeAvatarModal);
  document.getElementById("avatar-modal-cancel")?.addEventListener("click", closeAvatarModal);

  document.querySelectorAll(".avatar-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentTab = btn.dataset.tab;
      render();
    });
  });

  document.querySelectorAll(".avatar-grid-item").forEach((item) => {
    item.addEventListener("click", () => {
      selectedUrl = item.dataset.avatarUrl;
      document.querySelectorAll(".avatar-grid-item").forEach((el) => el.classList.remove("selected"));
      item.classList.add("selected");
      updatePreview();
      updateSaveButton();
    });
  });

  document.getElementById("avatar-page-prev")?.addEventListener("click", () => {
    if (currentPage > 1) { currentPage--; render(); }
  });

  document.getElementById("avatar-page-next")?.addEventListener("click", () => {
    const totalPages = Math.ceil(TOTAL_AVATARS / AVATARS_PER_PAGE);
    if (currentPage < totalPages) { currentPage++; render(); }
  });

  const fileInput = document.getElementById("avatar-file-input");
  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowed = ["png", "jpg", "jpeg", "svg", "gif"];
    const errorEl = document.getElementById("avatar-modal-error");

    if (!ext || !allowed.includes(ext)) {
      errorEl.textContent = "File type not allowed. Allowed: PNG, JPG, JPEG, SVG, GIF";
      errorEl.classList.remove("hidden");
      fileInput.value = "";
      return;
    }

    if (file.size > 16 * 1024 * 1024) {
      errorEl.textContent = "File exceeds 16 MB limit";
      errorEl.classList.remove("hidden");
      fileInput.value = "";
      return;
    }

    errorEl.classList.add("hidden");
    uploadFile = file;
    render();
  });

  document.getElementById("avatar-modal-save")?.addEventListener("click", handleSave);
}

function updatePreview() {
  const preview = dialog?.querySelector(".avatar-modal-preview");
  if (preview && selectedUrl) {
    preview.innerHTML = `<img src="${UPLOADS_BASE}${selectedUrl}" alt="Preview" class="avatar-preview-img" />`;
  }
}

function canSave() {
  return !!(selectedUrl || uploadFile);
}

function updateSaveButton() {
  const btn = document.getElementById("avatar-modal-save");
  if (btn) btn.disabled = !canSave();
}

async function handleSave() {
  const btn = document.getElementById("avatar-modal-save");
  const errorEl = document.getElementById("avatar-modal-error");
  btn.disabled = true;
  btn.textContent = "Saving...";
  errorEl?.classList.add("hidden");

  try {
    let result;

    if (currentTab === "gallery" && selectedUrl) {
      result = await patchApiData("/auth/me", { avatar_url: selectedUrl });
    } else if (currentTab === "upload" && uploadFile) {
      const formData = new FormData();
      formData.append("file", uploadFile);
      result = await postFormData("/auth/me/avatar", formData);
    } else {
      throw new Error("No avatar selected");
    }

    if (onSaveCallback) onSaveCallback(result);
    closeAvatarModal();
  } catch (err) {
    if (errorEl) {
      errorEl.textContent = err.message || "Something went wrong";
      errorEl.classList.remove("hidden");
    }
    btn.disabled = false;
    btn.textContent = "Save";
  }
}

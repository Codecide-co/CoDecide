export function FileUploadView({ id, label, multiple = true, accept = "image/*" }) {
  return `
    <div>
      <label for="${id}">${label}</label>
      <div class="file-upload-custom">
        <button type="button" class="file-upload-btn" data-for="${id}">Choose file</button>
        <span class="file-upload-text" id="${id}-text">No file chosen</span>
      </div>
      <input id="${id}" name="${id}" type="file" accept="${accept}" ${multiple ? "multiple" : ""} hidden>
      <div id="${id}-preview" class="file-preview-grid"></div>
      <small id="${id}-error"></small>
    </div>
  `;
}

export function initFileUpload(id) {
  const input = document.getElementById(id);
  const preview = document.getElementById(`${id}-preview`);
  if (!input || !preview) return { getFiles: () => [] };

  let files = [];
  const objectUrls = [];

  function render() {
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.length = 0;
    preview.innerHTML = "";

    files.forEach((file, index) => {
      const url = URL.createObjectURL(file);
      objectUrls.push(url);

      const item = document.createElement("div");
      item.className = "file-preview-item";

      const img = document.createElement("img");
      img.src = url;
      img.alt = file.name;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.setAttribute("aria-label", `Remove ${file.name}`);
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", () => {
        files.splice(index, 1);
        render();
      });

      item.append(img, removeBtn);
      preview.appendChild(item);
    });
  }

  const textEl = document.getElementById(`${id}-text`);
  const btn = document.querySelector(`.file-upload-btn[data-for="${id}"]`);
  if (btn) {
    btn.addEventListener("click", () => input.click());
  }

  input.addEventListener("change", () => {
    const newFiles = Array.from(input.files);
    files = [...files, ...newFiles];
    input.value = "";
    textEl.textContent = files.length
      ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
      : "No file chosen";
    render();
  });

  return {
    getFiles: () => files,
  };
}

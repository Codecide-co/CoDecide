export function FileUploadView({ id, label, multiple = true, accept = "image/*" }) {
  return `
    <div>
      <label for="${id}">${label}</label>
      <input id="${id}" name="${id}" type="file" accept="${accept}" ${multiple ? "multiple" : ""}>
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

  input.addEventListener("change", () => {
    files = [...files, ...Array.from(input.files)];
    input.value = ""; // permite volver a elegir el mismo archivo o sumar más
    render();
  });

  return {
    getFiles: () => files,
  };
}

export function SelectView({ id, label, options = [], placeholder = "Select an option", disabled = false }) {
  const optionsHtml = options
    .map((opt) => `<option value="${opt.id}">${opt.name}</option>`)
    .join("");

  return `
    <div>
      <label for="${id}">${label}</label>
      <select id="${id}" name="${id}" ${disabled ? "disabled" : ""}>
        <option value="" selected disabled>${placeholder}</option>
        ${optionsHtml}
      </select>
      <small id="${id}-error"></small>
    </div>
  `;
}

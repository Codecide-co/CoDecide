export function TextAreaView({ id, label, placeholder = "", maxLength = 500 }) {
  return `
    <div>
      <label for="${id}">${label}</label>
      <textarea id="${id}" name="${id}" placeholder="${placeholder}" maxlength="${maxLength}" rows="5"></textarea>
      <div>
        <small id="${id}-error"></small>
        <small id="${id}-count">0/${maxLength}</small>
      </div>
    </div>
  `;
}

export function initTextAreaCount(id, maxLength = 500) {
  const textarea = document.getElementById(id);
  const counter = document.getElementById(`${id}-count`);
  if (!textarea || !counter) return;

  textarea.addEventListener("input", () => {
    counter.textContent = `${textarea.value.length}/${maxLength}`;
  });
}

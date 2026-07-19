import { SelectView } from "@components/ui/Select";

export function CategoryPickerView() {
  return SelectView({
    id: "category",
    label: "Category",
    options: [],
    placeholder: "Loading categories...",
    disabled: true,
  });
}

export function initCategoryPicker(categories) {
  const select = document.getElementById("category");
  if (!select) return;

  select.disabled = false;
  select.innerHTML =
    `<option value="" selected disabled>Select a category</option>` +
    categories.map((cat) => `<option value="${cat.id}">${cat.name}</option>`).join("");
}

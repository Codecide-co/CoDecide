import { SelectView } from "@components/ui/Select";
import { getCategories } from "@services/categories.service";

export function CategoryPickerView() {
  return SelectView({
    id: "category",
    label: "Category",
    options: [],
    placeholder: "Loading categories...",
    disabled: true,
  });
}

export async function initCategoryPicker() {
  const select = document.getElementById("category");
  if (!select) return;

  try {
    const categories = await getCategories();

    select.disabled = false;
    select.innerHTML =
      `<option value="" selected disabled>Select a category</option>` +
      categories.map((cat) => `<option value="${cat.id}">${cat.name}</option>`).join("");
  } catch (error) {
    select.disabled = true;
    select.innerHTML = `<option value="" selected>Couldn't load categories</option>`;
  }
}

import { SelectView } from "@components/ui/Select";
import { t } from "@core/i18n";

export function CategoryPickerView() {
  return SelectView({
    id: "category",
    label: "Category",
    options: [],
    placeholder: `${t("category.loading")}`,
    disabled: true,
  });
}

export function initCategoryPicker(categories) {
  const select = document.getElementById("category");
  if (!select) return;

  select.disabled = false;
  select.innerHTML =
    `<option value="" selected disabled>${t("category.select")}</option>` +
    categories.map((cat) => `<option value="${cat.id}">${cat.name}</option>`).join("");
}

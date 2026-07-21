import { HeaderHome } from "@layouts/Header";
import { SidebarHome } from "@layouts/Sidebar";
import { TextAreaView, initTextAreaCount } from "@components/ui/TextArea";
import { FileUploadView, initFileUpload } from "@components/ui/FileUpload";
import { CategoryPickerView, initCategoryPicker } from "@components/domain/CategoryPicker";
import { validateReportForm, DESCRIPTION_MAX_LENGTH } from "@core/validators";
import { createReport } from "@services/reports.service";
import { uploadAttachment } from "@services/attachments.service";
import { getCategories } from "@services/categories.service";
import { t } from "@core/i18n";

let isSubmitting = false;

export function CreateReportView() {
  return `
    ${HeaderHome()}
    <div class="auth-layout flex flex-row">
      ${SidebarHome()}
      <main class="container-home container-home--create-report">
        <section class="report-page create-report-section">

        <header>
            <h2>${t("report.new.title")}</h2>
            <p>${t("report.new.subtitle")}</p>
        </header>

        <form id="create-report-form" novalidate>

            <div>
                <label for="title">${t("report.new.title_label")}</label>
                <input id="title" name="title" type="text" placeholder="${t("report.new.title_placeholder")}">
                <small id="title-error"></small>
            </div>

            ${TextAreaView({
              id: "description",
              label: t("report.new.desc_label"),
              placeholder: t("report.new.desc_placeholder"),
              maxLength: DESCRIPTION_MAX_LENGTH,
            })}

            ${CategoryPickerView()}

            ${FileUploadView({
              id: "photos",
              label: t("report.new.photos_label"),
              multiple: true,
              accept: ".png,.jpg,.jpeg,.gif,.webp,.pdf,.doc,.docx,.mp4,.mov,.avi",
            })}

            <div class="anonymous-checkbox-wrap">
                <label for="anonymous">
                    <input id="anonymous" name="anonymous" type="checkbox">
                    ${t("report.new.anonymous_label")}
                    <span class="anonymous-tooltip">${t("report.new.anonymous_tooltip")}</span>
                </label>
            </div>

            <div id="submit-error" role="alert"></div>

            <button id="submit-btn" type="submit">
                ${t("report.new.submit")}
            </button>

        </form>

        </section>
      </main>
    </div>`;
}

export function initCreateReportView(onSuccess) {
  const form = document.getElementById("create-report-form");
  if (!form) return;

  getCategories().then((cats) => initCategoryPicker(cats)).catch(() => {});
  initTextAreaCount("description", DESCRIPTION_MAX_LENGTH);
  const fileUpload = initFileUpload("photos");

  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const categorySelect = document.getElementById("category");
  const anonymousInput = document.getElementById("anonymous");

  const titleError = document.getElementById("title-error");
  const descriptionError = document.getElementById("description-error");
  const categoryError = document.getElementById("category-error");
  const submitError = document.getElementById("submit-error");
  const submitBtn = document.getElementById("submit-btn");

  function clearErrors() {
    titleError.textContent = "";
    descriptionError.textContent = "";
    categoryError.textContent = "";
    submitError.textContent = "";
  }

  function setLoading(loading) {
    isSubmitting = loading;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? t("report.new.submitting") : t("report.new.submit");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const categoryId = categorySelect.value;

    clearErrors();

    const { isValid, errors } = validateReportForm({ title, description, categoryId });
    if (!isValid) {
      titleError.textContent = errors.title || "";
      descriptionError.textContent = errors.description || "";
      categoryError.textContent = errors.category || "";
      return;
    }

    setLoading(true);

    const payload = {
      title,
      description,
      category_id: parseInt(categoryId, 10),
      is_anonymous: anonymousInput.checked,
    };

    try {
      const report = await createReport(payload);

      const files = fileUpload.getFiles();
      let uploadedPhotos = [];
      if (files.length > 0) {
        submitBtn.textContent = t("report.new.uploading");
        const results = await Promise.allSettled(
          files.map((f) => uploadAttachment(report.id, f))
        );
        const failures = results.filter((r) => r.status === "rejected");
        if (failures.length > 0) {
          console.warn("Some attachments failed to upload:", failures.map((r) => r.reason));
        }
        uploadedPhotos = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value);
      }

      setLoading(false);
      form.reset();
      if (typeof onSuccess === "function") onSuccess(report, uploadedPhotos);
    } catch (error) {
      setLoading(false);
      submitError.textContent = error.message || t("report.new.error");
    }
  });
}
import { TextAreaView, initTextAreaCount } from "@components/ui/TextArea";
import { FileUploadView, initFileUpload } from "@components/ui/FileUpload";
import { CategoryPickerView, initCategoryPicker } from "@components/domain/CategoryPicker";
import { validateReportForm, DESCRIPTION_MAX_LENGTH } from "@utils/validators";
import { createReport } from "@services/reports.service";

let isSubmitting = false;

export function CreateReportView() {
  return `
    <section class="report-page">

    <header>
        <h2>New Report</h2>
        <p>Describe the issue so your community can take action.</p>
    </header>

    <form id="create-report-form" novalidate>

        <div>
            <label for="title">Title</label>
            <input id="title" name="title" type="text" placeholder="e.g. Water leak in parking lot">
            <small id="title-error"></small>
        </div>

        ${TextAreaView({
          id: "description",
          label: "Description",
          placeholder: "Give as much detail as possible...",
          maxLength: DESCRIPTION_MAX_LENGTH,
        })}

        ${CategoryPickerView()}

        ${FileUploadView({
          id: "photos",
          label: "Photos (optional)",
          multiple: true,
          accept: "image/*",
        })}

        <div class="anonymous-checkbox-wrap">
            <label for="anonymous">
                <input id="anonymous" name="anonymous" type="checkbox">
                Submit anonymously
                <span class="anonymous-tooltip">Your name and personal details will not be displayed with this report. Community members and authorities will see the issue without knowing who submitted it.</span>
            </label>
        </div>

        <div id="submit-error" role="alert"></div>

        <button id="submit-btn" type="submit">
            Submit Report
        </button>

    </form>

    </section>`;
}

export function initCreateReportView(onSuccess) {
  const form = document.getElementById("create-report-form");
  if (!form) return;

  initCategoryPicker();
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
    submitBtn.textContent = loading ? "Submitting..." : "Submit Report";
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
      setLoading(false);
      form.reset();
      if (typeof onSuccess === "function") onSuccess(report);
    } catch (error) {
      setLoading(false);
      submitError.textContent = "Something went wrong submitting your report. Please try again.";
    }
  });
}

import { t } from "@core/i18n";

export function useFormSubmit(formId, { validator, onSubmit, onSuccess }) {
  const form = document.getElementById(formId);
  if (!form) return;

  const errorFields = form.querySelectorAll("[id$='-error']");

  function clearErrors() {
    errorFields.forEach((el) => (el.textContent = ""));
  }

  function setLoading(loading, btn, text) {
    btn.disabled = loading;
    btn.textContent = loading ? text : btn.dataset.originalText;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn?.disabled) return;

    if (!submitBtn.dataset.originalText) {
      submitBtn.dataset.originalText = submitBtn.textContent;
    }

    clearErrors();

    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    if (validator) {
      const { isValid, errors } = validator(values);
      if (!isValid) {
        Object.entries(errors).forEach(([key, msg]) => {
          const el = document.getElementById(`${key}-error`);
          if (el) el.textContent = msg;
        });
        return;
      }
    }

    setLoading(true, submitBtn, t("common.processing"));

    try {
      await onSubmit(values);
      form.reset();
      if (typeof onSuccess === "function") onSuccess();
    } catch (error) {
      const globalError = form.querySelector("[id$='-error'][role='alert']");
      if (globalError) {
        globalError.textContent = error.message || t("common.error_try_again");
      }
    }

    setLoading(false, submitBtn, "");
  });
}

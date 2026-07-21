import { t } from "@core/i18n";

export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim());
}

export function validateLoginForm({ email, password }) {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = t("validator.email_required");
  } else if (!isValidEmail(email)) {
    errors.email = t("validator.email_invalid");
  }

  if (!password) {
    errors.password = t("validator.password_required");
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateRegisterForm({ name, email, tower, apartment, password, confirmPassword }) {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = t("validator.name_required");
  }

  if (!email || !email.trim()) {
    errors.email = t("validator.email_required");
  } else if (!isValidEmail(email)) {
    errors.email = t("validator.email_invalid");
  }

  if (!tower || !tower.trim()) {
    errors.tower = t("validator.tower_required");
  }

  if (!apartment || !apartment.trim()) {
    errors.apartment = t("validator.apartment_required");
  }

  if (!password) {
    errors.password = t("validator.password_required");
  } else if (password.length < 6) {
    errors.password = t("validator.password_minlength");
  }

  if (!confirmPassword) {
    errors.confirmPassword = t("validator.password_confirm");
  } else if (password && confirmPassword !== password) {
    errors.confirmPassword = t("validator.password_mismatch");
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export const DESCRIPTION_MAX_LENGTH = 500;

export function validateReportForm({ title, description, categoryId }) {
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = t("validator.title_required");
  } else if (title.trim().length < 5) {
    errors.title = t("validator.title_minlength");
  }

  if (!description || !description.trim()) {
    errors.description = t("validator.description_required");
  } else if (description.trim().length < 20) {
    errors.description = t("validator.description_minlength");
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = t("validator.description_maxlength", { max: DESCRIPTION_MAX_LENGTH });
  }

  if (!categoryId) {
    errors.category = t("validator.category_required");
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

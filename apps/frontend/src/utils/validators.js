export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim());
}

export function validateLoginForm({ email, password }) {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "An email address is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "The password is required";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateRegisterForm({ name, email, tower, apartment, password, confirmPassword }) {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "The name is required";
  }

  if (!email || !email.trim()) {
    errors.email = "An email address is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!tower || !tower.trim()) {
    errors.tower = "The tower is required";
  }

  if (!apartment || !apartment.trim()) {
    errors.apartment = "The apartment is required";
  }

  if (!password) {
    errors.password = "The password is required";
  } else if (password.length < 6) {
    errors.password = "The password must be at least 6 characters long"
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm your password";
  } else if (password && confirmPassword !== password) {
    errors.confirmPassword = "The passwords do not match ";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export const DESCRIPTION_MAX_LENGTH = 500;

export function validateReportForm({ title, description, categoryId }) {
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = "Title is required";
  } else if (title.trim().length < 5) {
    errors.title = "Title must be at least 5 characters";
  }

  if (!description || !description.trim()) {
    errors.description = "Description is required";
  } else if (description.trim().length < 20) {
    errors.description = "Description must be at least 20 characters";
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be under ${DESCRIPTION_MAX_LENGTH} characters`;
  }

  if (!categoryId) {
    errors.category = "Please select a category";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

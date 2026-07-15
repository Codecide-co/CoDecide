export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim());
}

export function validateLoginForm({ email, password }) {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "El correo es obligatorio";
  } else if (!isValidEmail(email)) {
    errors.email = "Ingresa un correo válido";
  }

  if (!password) {
    errors.password = "La contraseña es obligatoria";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateRegisterForm({ name, email, tower, apartment, password, confirmPassword }) {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "El nombre es obligatorio";
  }

  if (!email || !email.trim()) {
    errors.email = "El correo es obligatorio";
  } else if (!isValidEmail(email)) {
    errors.email = "Ingresa un correo válido";
  }

  if (!tower || !tower.trim()) {
    errors.tower = "La torre es obligatoria";
  }

  if (!apartment || !apartment.trim()) {
    errors.apartment = "El apartamento es obligatorio";
  }

  if (!password) {
    errors.password = "La contraseña es obligatoria";
  } else if (password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres"
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirma tu contraseña";
  } else if (password && confirmPassword !== password) {
    errors.confirmPassword = "Las contraseñas no coinciden";
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

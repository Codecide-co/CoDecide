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

export function validateRegisterForm({ name, email, tower, apartament, password, confirmPassword }) {
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

  if (!apartament || !apartament.trim()) {
    errors.apartament = "El apartamento es obligatorio";
  }

  if (!password) {
    errors.password = "La contraseña es obligatoria";
  } else if (password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres"
  }

  if (confirmPassword) {
    errors.confirmPassword = "Confirma tu contraseña";
  } else if (password && confirmPassword !== password) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
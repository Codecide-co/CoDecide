import { describe, it, expect } from 'vitest'
import { isValidEmail, validateLoginForm, validateRegisterForm } from '@core/validators'

describe('isValidEmail', () => {
  it('returns true for a valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
  })

  it('returns true for email with subdomain', () => {
    expect(isValidEmail('user@mail.co.uk')).toBe(true)
  })

  it('returns true for email with plus sign', () => {
    expect(isValidEmail('user+tag@example.com')).toBe(true)
  })

  it('returns false for email without @', () => {
    expect(isValidEmail('invalid')).toBe(false)
  })

  it('returns false for email without domain', () => {
    expect(isValidEmail('user@')).toBe(false)
  })

  it('returns false for email without local part', () => {
    expect(isValidEmail('@example.com')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })

  it('returns false for whitespace-only string', () => {
    expect(isValidEmail('   ')).toBe(false)
  })

  it('trims whitespace before validating', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true)
  })
})

describe('validateLoginForm', () => {
  it('returns errors for empty fields', () => {
    const result = validateLoginForm({ email: '', password: '' })
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBe('El correo electrónico es obligatorio')
    expect(result.errors.password).toBe('La contraseña es obligatoria')
  })

  it('returns error for invalid email format', () => {
    const result = validateLoginForm({ email: 'notanemail', password: 'secret' })
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBe('Ingresa un correo electrónico válido')
    expect(result.errors.password).toBeUndefined()
  })

  it('returns valid for correct data', () => {
    const result = validateLoginForm({ email: 'user@example.com', password: 'secret' })
    expect(result.isValid).toBe(true)
    expect(Object.keys(result.errors).length).toBe(0)
  })

  it('returns error for whitespace-only email', () => {
    const result = validateLoginForm({ email: '   ', password: 'secret' })
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBe('El correo electrónico es obligatorio')
  })

  it('returns error for missing password', () => {
    const result = validateLoginForm({ email: 'user@example.com' })
    expect(result.isValid).toBe(false)
    expect(result.errors.password).toBe('La contraseña es obligatoria')
  })
})

describe('validateRegisterForm', () => {
  const validData = {
    name: 'John Doe',
    email: 'john@example.com',
    tower: 'A',
    apartment: '101',
    password: 'secret123',
    confirmPassword: 'secret123',
  }

  it('returns valid when all fields are correct', () => {
    const result = validateRegisterForm(validData)
    expect(result.isValid).toBe(true)
    expect(Object.keys(result.errors).length).toBe(0)
  })

  it('returns errors when required fields are missing', () => {
    const result = validateRegisterForm({
      name: '',
      email: '',
      tower: '',
      apartment: '',
      password: '',
      confirmPassword: '',
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.name).toBe('El nombre es obligatorio')
    expect(result.errors.email).toBe('El correo electrónico es obligatorio')
    expect(result.errors.tower).toBe('La torre es obligatoria')
    expect(result.errors.apartment).toBe('El apartamento es obligatorio')
    expect(result.errors.password).toBe('La contraseña es obligatoria')
    expect(result.errors.confirmPassword).toBe('Confirma tu contraseña')
  })

  it('returns error when passwords do not match', () => {
    const result = validateRegisterForm({
      ...validData,
      confirmPassword: 'different',
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.confirmPassword).toBe('Las contraseñas no coinciden')
  })

  it('returns error when password is too short', () => {
    const result = validateRegisterForm({
      ...validData,
      password: '12345',
      confirmPassword: '12345',
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.password).toBe('La contraseña debe tener al menos 6 caracteres')
  })

  it('returns error for invalid email format', () => {
    const result = validateRegisterForm({
      ...validData,
      email: 'bademail',
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBe('Ingresa un correo electrónico válido')
  })

  it('returns error when name is whitespace only', () => {
    const result = validateRegisterForm({
      ...validData,
      name: '   ',
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.name).toBe('El nombre es obligatorio')
  })

  it('returns error when tower is whitespace only', () => {
    const result = validateRegisterForm({
      ...validData,
      tower: '   ',
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.tower).toBe('La torre es obligatoria')
  })
})

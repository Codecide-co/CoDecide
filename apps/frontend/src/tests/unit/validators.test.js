import { describe, it, expect } from 'vitest'
import { isValidEmail, validateLoginForm, validateRegisterForm } from '../../utils/validators.js'

describe('isValidEmail()', () => {
  it.each([
    ['user@example.com', true],
    ['test@test.co', true],
    ['a@b.cd', true],
    ['', false],
    ['not-an-email', false],
    ['@domain.com', false],
    ['user@', false],
    ['user@.com', false],
  ])('returns %s for "%s"', (email, expected) => {
    expect(isValidEmail(email)).toBe(expected)
  })
})

describe('validateLoginForm()', () => {
  it('returns error for empty email and password', () => {
    const result = validateLoginForm({ email: '', password: '' })
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBe('An email address is required')
    expect(result.errors.password).toBe('The password is required')
  })

  it('returns error for invalid email format', () => {
    const result = validateLoginForm({ email: 'bad', password: 'secret' })
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBe('Enter a valid email address')
    expect(result.errors.password).toBeUndefined()
  })

  it('returns valid for correct data', () => {
    const result = validateLoginForm({ email: 'user@example.com', password: 'secret' })
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })
})

describe('validateRegisterForm()', () => {
  const validData = {
    name: 'John',
    email: 'john@example.com',
    tower: 'A',
    apartment: '101',
    password: 'secret123',
    confirmPassword: 'secret123',
  }

  it('returns valid when all fields are correct', () => {
    const result = validateRegisterForm(validData)
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('returns errors for missing fields', () => {
    const result = validateRegisterForm({
      name: '', email: '', tower: '', apartment: '',
      password: '', confirmPassword: '',
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.name).toBe('The name is required')
    expect(result.errors.email).toBe('An email address is required')
    expect(result.errors.tower).toBe('The tower is required')
    expect(result.errors.apartment).toBe('The apartment is required')
    expect(result.errors.password).toBe('The password is required')
    expect(result.errors.confirmPassword).toBe('Confirm your password')
  })

  it('returns error for mismatched passwords', () => {
    const result = validateRegisterForm({ ...validData, confirmPassword: 'different' })
    expect(result.isValid).toBe(false)
    expect(result.errors.confirmPassword).toBe('The passwords do not match ')
  })

  it('returns error for short password', () => {
    const result = validateRegisterForm({ ...validData, password: 'ab', confirmPassword: 'ab' })
    expect(result.isValid).toBe(false)
    expect(result.errors.password).toBe('The password must be at least 6 characters long')
  })
})

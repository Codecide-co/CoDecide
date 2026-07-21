import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AuthError, login, register } from '@services/auth.service.js'

vi.mock('@core/api', () => ({
  postApiData: vi.fn(),
}))

import { postApiData } from '@core/api'

describe('AuthError', () => {
  it('creates an error with message and status', () => {
    const err = new AuthError('Unauthorized', 401)
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('Unauthorized')
    expect(err.status).toBe(401)
    expect(err.name).toBe('AuthError')
  })
})

describe('login', () => {
  beforeEach(() => {
    postApiData.mockResolvedValue({ token: 'abc', user: { id: 1 } })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('calls postApiData with /auth/login and credentials', async () => {
    await login('test@example.com', 'secret123')
    expect(postApiData).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'secret123',
    })
  })

  it('returns the data from postApiData on success', async () => {
    const result = await login('a@b.com', 'pwd')
    expect(result).toEqual({ token: 'abc', user: { id: 1 } })
  })

  it('throws when postApiData rejects', async () => {
    postApiData.mockRejectedValue(new Error('Network error'))
    await expect(login('a@b.com', 'pwd')).rejects.toThrow('Network error')
  })
})

describe('register', () => {
  const userData = {
    name: 'John',
    email: 'john@example.com',
    password: 'secret123',
    tower: 'A',
    apartment: '101',
  }

  beforeEach(() => {
    postApiData.mockResolvedValue({ token: 'xyz', user: { id: 2 } })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('calls postApiData with /auth/register and user data', async () => {
    await register(userData)
    expect(postApiData).toHaveBeenCalledWith('/auth/register', userData)
  })

  it('returns the data from postApiData on success', async () => {
    const result = await register(userData)
    expect(result).toEqual({ token: 'xyz', user: { id: 2 } })
  })

  it('throws when postApiData rejects', async () => {
    postApiData.mockRejectedValue(new Error('Email already registered'))
    await expect(register(userData)).rejects.toThrow('Email already registered')
  })
})

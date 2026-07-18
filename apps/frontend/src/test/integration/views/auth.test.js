import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { LoginView, initLoginView } from '@pages/auth/login.view'
import { RegisterView, initRegisterView } from '@pages/auth/register.view'

vi.mock('@store/auth.store', () => ({
  login: vi.fn(),
  register: vi.fn(),
}))

vi.mock('@/utils/navigate.js', () => ({
  navigateTo: vi.fn(),
}))

function setBody(html) {
  document.body.innerHTML = `<div id="app">${html}</div>`
}

describe('LoginView rendering', () => {
  it('renders email field', () => {
    setBody(LoginView())
    expect(document.getElementById('email')).not.toBeNull()
    expect(document.getElementById('email').placeholder).toBe('email@example.com')
  })

  it('renders password field', () => {
    setBody(LoginView())
    expect(document.getElementById('password')).not.toBeNull()
    expect(document.getElementById('password').placeholder).toBe('••••••••')
  })

  it('renders submit button', () => {
    setBody(LoginView())
    const btn = document.getElementById('login-btn')
    expect(btn).not.toBeNull()
    expect(btn.textContent).toBe('Log In')
  })

  it('renders register link', () => {
    setBody(LoginView())
    const link = document.getElementById('go-register')
    expect(link).not.toBeNull()
    expect(link.textContent).toBe('Sign Up')
  })
})

describe('RegisterView rendering', () => {
  it('renders all form fields', () => {
    setBody(RegisterView())
    expect(document.getElementById('name')).not.toBeNull()
    expect(document.getElementById('email')).not.toBeNull()
    expect(document.getElementById('tower')).not.toBeNull()
    expect(document.getElementById('apartment')).not.toBeNull()
    expect(document.getElementById('password')).not.toBeNull()
  })

  it('renders confirm password field', () => {
    setBody(RegisterView())
    const el = document.getElementById('confirm-password')
    expect(el).not.toBeNull()
    expect(el.placeholder).toBe('••••••••')
  })
})

describe('LoginView form submission', () => {
  beforeEach(() => {
    setBody(LoginView())
    vi.clearAllMocks()
  })

  it('calls login with email and password on valid submission', async () => {
    const { login } = await import('@store/auth.store')
    login.mockResolvedValue({ token: 'abc' })
    initLoginView(() => {})

    document.getElementById('email').value = 'test@example.com'
    document.getElementById('password').value = 'secret123'
    document.getElementById('login-form').dispatchEvent(new Event('submit', { cancelable: true }))

    await vi.waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'secret123')
    })
  })

  it('shows inline errors on empty submission', async () => {
    initLoginView(() => {})

    document.getElementById('login-form').dispatchEvent(new Event('submit', { cancelable: true }))

    await vi.waitFor(() => {
      expect(document.getElementById('email-error').textContent).toBeTruthy()
      expect(document.getElementById('password-error').textContent).toBeTruthy()
    })
  })

  it('sets button loading state during submission', async () => {
    const { login } = await import('@store/auth.store')
    let resolveLogin
    login.mockReturnValue(new Promise((resolve) => { resolveLogin = resolve }))
    initLoginView(() => {})

    document.getElementById('email').value = 'a@b.com'
    document.getElementById('password').value = 'secret'
    document.getElementById('login-form').dispatchEvent(new Event('submit', { cancelable: true }))

    const btn = document.getElementById('login-btn')
    expect(btn.textContent).toBe('Processing...')
    expect(btn.disabled).toBe(true)

    resolveLogin({ token: 'abc' })
    await vi.waitFor(() => {
      expect(btn.textContent).toBe('Log In')
      expect(btn.disabled).toBe(false)
    })
  })
})

describe('RegisterView form submission', () => {
  beforeEach(() => {
    setBody(RegisterView())
    vi.clearAllMocks()
  })

  it('calls register with user data (without confirmPassword) on valid submission', async () => {
    const { register } = await import('@store/auth.store')
    register.mockResolvedValue({ token: 'xyz' })
    initRegisterView(() => {})

    document.getElementById('name').value = 'John'
    document.getElementById('email').value = 'john@example.com'
    document.getElementById('tower').value = 'A'
    document.getElementById('apartment').value = '101'
    document.getElementById('password').value = 'secret123'
    document.getElementById('confirm-password').value = 'secret123'
    document.getElementById('register-form').dispatchEvent(new Event('submit', { cancelable: true }))

    await vi.waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@example.com',
        tower: 'A',
        apartment: '101',
        password: 'secret123',
      })
    })
  })

  it('shows inline errors on empty submission', async () => {
    initRegisterView(() => {})

    document.getElementById('register-form').dispatchEvent(new Event('submit', { cancelable: true }))

    await vi.waitFor(() => {
      expect(document.getElementById('name-error').textContent).toBeTruthy()
      expect(document.getElementById('email-error').textContent).toBeTruthy()
    })
  })
})

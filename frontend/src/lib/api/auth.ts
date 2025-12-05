import { apiFetch } from './client'

export async function register(payload: {
  email: string
  login: string
  password: string
  password_confirmation: string
  birth_date?: string
  language?: string
}) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function login(payload: { login_or_email: string; password: string; remember?: boolean }) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function logout() {
  return apiFetch('/api/auth/logout', { method: 'POST' })
}

export async function fetchMe() {
  return apiFetch('/api/auth/me')
}

export async function resendVerification() {
  return apiFetch('/api/auth/email/resend', { method: 'POST' })
}

export async function sendForgotPassword(login_or_email: string) {
  return apiFetch('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ login_or_email }),
  })
}

export async function resetPassword(payload: {
  token: string
  email: string
  password: string
  password_confirmation: string
}) {
  return apiFetch('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

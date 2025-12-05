import { getToken } from '../auth-storage'

function resolveApiBaseUrl() {
  if (typeof window !== 'undefined') {
    const current = new URL(window.location.href)
    const port = current.port && current.port !== '3030' ? current.port : '8082'
    return `${current.protocol}//${current.hostname}:${port}`
  }

  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (envUrl && !/localhost|127\.0\.0\.1/.test(envUrl)) {
    return envUrl
  }

  // SSR/CI fallback — работает внутри docker-compose по имени сервиса
  return 'http://api:8000'
}

export function getApiBaseUrl() {
  return resolveApiBaseUrl()
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const apiBaseUrl = getApiBaseUrl()
  const token = typeof window !== 'undefined' ? getToken() : null
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const error = new Error((data && data.message) || 'API error') as Error & {
      status?: number
      code?: string
      errors?: any
    }
    ;(error as any).status = res.status
    ;(error as any).code = data.code
    ;(error as any).errors = data.errors
    throw error
  }

  return data
}

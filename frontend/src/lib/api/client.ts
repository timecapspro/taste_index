import { getToken } from '../auth-storage'

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export async function apiFetch(path: string, options: RequestInit = {}) {
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

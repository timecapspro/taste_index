export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}

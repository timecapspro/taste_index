import { apiFetch } from './client'
import { Film } from './films'

export type UserSummary = {
  id: number
  login: string
  email: string
  match_percent: number
}

export type UsersResponse = {
  data: UserSummary[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export async function fetchUsers(params: Record<string, any> = {}): Promise<UsersResponse> {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    search.append(key, String(value))
  })
  const query = search.toString()
  return apiFetch(`/api/users${query ? `?${query}` : ''}`)
}

export type UserRatingItem = {
  id: number
  rating: number
  film: Film & { user_rating?: number }
}

export type UserDetailResponse = {
  user: UserSummary
  ratings: {
    data: UserRatingItem[]
    meta: {
      current_page: number
      last_page: number
      per_page: number
      total: number
    }
  }
}

export async function fetchUser(id: number, params: Record<string, any> = {}): Promise<UserDetailResponse> {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    search.append(key, String(value))
  })
  const query = search.toString()
  return apiFetch(`/api/users/${id}${query ? `?${query}` : ''}`)
}

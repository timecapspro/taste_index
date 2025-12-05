import { apiFetch } from './client'

export type MeStats = {
  favorites: number
  watch_later: number
  ratings: number
  submissions: number
}

export async function fetchMeStats(): Promise<MeStats> {
  return apiFetch('/api/me/stats')
}

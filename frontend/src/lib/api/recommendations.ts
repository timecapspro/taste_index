import { apiFetch } from './client'
import { Film } from './films'

export type RecommendationResponse = {
  need_more_ratings: boolean
  data: Film[]
}

export async function fetchRecommendations(): Promise<RecommendationResponse> {
  return apiFetch('/api/recommendations')
}

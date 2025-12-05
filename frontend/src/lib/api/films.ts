import { apiFetch } from './client'

export type Film = {
  id: number
  title: string
  original_title?: string
  year: number
  duration_min?: number
  director?: string
  description?: string | null
  is_18_plus: boolean
  poster_url?: string | null
  blocked?: boolean
  genres: { id: number; name: string }[]
  countries: { id: number; name: string }[]
  avg_rating: number
  my_rating: number | null
  user_rating?: number | null
  is_favorite: boolean
  is_watch_later: boolean
  my_note?: string | null
}

export type FilmListResponse = {
  data: Film[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  filters: {
    genres: { id: number; name: string }[]
    countries: { id: number; name: string }[]
    years: { min: number; max: number }
  }
}

export type FetchFilmsParams = Record<string, any>

export async function fetchFilms(params: FetchFilmsParams = {}): Promise<FilmListResponse> {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      value.forEach((v) => search.append(key, String(v)))
    } else {
      search.append(key, String(value))
    }
  })
  const query = search.toString()
  return apiFetch(`/api/films${query ? `?${query}` : ''}`)
}

export async function setRating(filmId: number, value: number) {
  return apiFetch(`/api/films/${filmId}/rating`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  })
}

export async function removeRating(filmId: number) {
  return apiFetch(`/api/films/${filmId}/rating`, {
    method: 'DELETE',
  })
}

export async function toggleFavorite(filmId: number, active: boolean) {
  return apiFetch(`/api/films/${filmId}/favorite`, {
    method: active ? 'POST' : 'DELETE',
  })
}

export async function toggleWatchLater(filmId: number, active: boolean) {
  return apiFetch(`/api/films/${filmId}/watch-later`, {
    method: active ? 'POST' : 'DELETE',
  })
}

export async function fetchFilm(id: number): Promise<Film> {
  return apiFetch(`/api/films/${id}`)
}

export async function fetchNote(id: number): Promise<{ text: string }> {
  return apiFetch(`/api/films/${id}/note`)
}

export async function saveNote(id: number, text: string) {
  return apiFetch(`/api/films/${id}/note`, {
    method: 'PUT',
    body: JSON.stringify({ text }),
  })
}

export async function markWatched(id: number) {
  return apiFetch(`/api/films/${id}/watched`, {
    method: 'POST',
  })
}

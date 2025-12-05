import { apiFetch } from './client'

export type DictionaryItem = { id: number; name: string }

export async function fetchGenres(): Promise<DictionaryItem[]> {
  return apiFetch('/api/genres')
}

export async function fetchCountries(): Promise<DictionaryItem[]> {
  return apiFetch('/api/countries')
}

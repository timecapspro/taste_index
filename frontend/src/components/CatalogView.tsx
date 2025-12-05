'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import FilmCard from './FilmCard'
import { FetchFilmsParams, Film, FilmListResponse, fetchFilms } from '../lib/api/films'
import { fetchCountries, fetchGenres, DictionaryItem } from '../lib/api/reference'

const baseSortOptions = [
  { value: 'name', label: 'По названию' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'year', label: 'По году' },
]

type Props = {
  scope?: 'favorites' | 'watch_later' | 'my_ratings'
  emptyMessage?: string
  title?: string
}

export default function CatalogView({ scope, emptyMessage, title }: Props) {
  const params = useSearchParams()
  const router = useRouter()
  const [data, setData] = useState<FilmListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>(params.get('view') === 'list' ? 'list' : 'grid')
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [dicts, setDicts] = useState<{ genres: DictionaryItem[]; countries: DictionaryItem[] } | null>(null)

  const sortOptions = useMemo(() => {
    if (scope === 'my_ratings') {
      return [...baseSortOptions, { value: 'my_rating', label: 'По моей оценке' }]
    }
    return baseSortOptions
  }, [scope])

  const query = useMemo(() => {
    const base: FetchFilmsParams = {
      q: params.get('q') || '',
      sort: params.get('sort') || (scope === 'my_ratings' ? 'my_rating' : 'name'),
      page: Number(params.get('page') || 1),
      per_page: 12,
      year_min: params.get('year_min') || undefined,
      year_max: params.get('year_max') || undefined,
      scope,
    }
    const genreParams = params.getAll('genres')
    const countryParams = params.getAll('countries')
    if (genreParams.length) base.genres = genreParams
    if (countryParams.length) base.countries = countryParams
    return base
  }, [params, scope])

  useEffect(() => {
    fetchGenres()
      .then((genres) => setDicts((prev) => ({ countries: prev?.countries || [], genres })))
      .catch(() => null)
    fetchCountries()
      .then((countries) => setDicts((prev) => ({ genres: prev?.genres || [], countries })))
      .catch(() => null)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchFilms(query)
      .then((res) => setData(res))
      .finally(() => setLoading(false))
  }, [query])

  const updateUrl = (updates: Record<string, any>) => {
    const search = new URLSearchParams(params.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        search.delete(key)
      } else if (Array.isArray(value)) {
        search.delete(key)
        value.forEach((v) => search.append(key, String(v)))
      } else {
        search.set(key, String(value))
      }
    })
    router.replace(`/app/${scope === 'favorites' ? 'favorites' : scope === 'watch_later' ? 'watch-later' : scope === 'my_ratings' ? 'my-ratings' : 'films'}?${search.toString()}`)
  }

  const handleFilmChange = (updated: Film) => {
    if (!data) return
    setData({ ...data, data: data.data.map((f) => (f.id === updated.id ? updated : f)) })
  }

  const filters = data?.filters
  const genres = dicts?.genres || filters?.genres || []
  const countries = dicts?.countries || filters?.countries || []
  const yearMin = filters?.years?.min
  const yearMax = filters?.years?.max

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 gap-2">
          <input
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            placeholder="Поиск по названию"
            defaultValue={params.get('q') || ''}
            onBlur={(e) => updateUrl({ q: e.target.value, page: 1 })}
          />
          <select
            className="rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            value={params.get('sort') || (scope === 'my_ratings' ? 'my_rating' : 'name')}
            onChange={(e) => updateUrl({ sort: e.target.value })}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            className={`rounded px-3 py-2 text-sm ${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-slate-200 dark:bg-slate-700 dark:text-white'}`}
            onClick={() => setView('grid')}
          >
            Сетка
          </button>
          <button
            className={`rounded px-3 py-2 text-sm ${view === 'list' ? 'bg-slate-900 text-white' : 'bg-slate-200 dark:bg-slate-700 dark:text-white'}`}
            onClick={() => setView('list')}
          >
            Список
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title || 'Каталог'}</h2>
        <button className="text-sm underline" onClick={() => setFiltersOpen((prev) => !prev)}>
          {filtersOpen ? 'Свернуть фильтры' : 'Показать фильтры'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {filtersOpen && (
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Фильтры</h3>
              <button
                className="text-sm underline"
                onClick={() => updateUrl({ year_min: null, year_max: null, genres: [], countries: [], page: 1 })}
              >
                Сбросить
              </button>
            </div>
            {filters ? (
              <div className="mt-3 space-y-3 text-sm">
                <div>
                  <div className="mb-1 text-xs text-slate-500">Годы</div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="w-1/2 rounded border border-slate-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-800"
                      placeholder={yearMin ? `${yearMin}` : 'мин'}
                      defaultValue={params.get('year_min') || ''}
                      onBlur={(e) => updateUrl({ year_min: e.target.value || null, page: 1 })}
                    />
                    <input
                      type="number"
                      className="w-1/2 rounded border border-slate-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-800"
                      placeholder={yearMax ? `${yearMax}` : 'макс'}
                      defaultValue={params.get('year_max') || ''}
                      onBlur={(e) => updateUrl({ year_max: e.target.value || null, page: 1 })}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs text-slate-500">Жанры</div>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((g) => {
                      const active = params.getAll('genres').includes(String(g.id))
                      return (
                        <button
                          key={g.id}
                          onClick={() => {
                            const current = new Set(params.getAll('genres'))
                            if (active) {
                              current.delete(String(g.id))
                            } else {
                              current.add(String(g.id))
                            }
                            updateUrl({ genres: Array.from(current), page: 1 })
                          }}
                          className={`rounded px-2 py-1 text-xs ${active ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
                        >
                          {g.name}
                        </button>
                      )
                    })}
                    {!genres.length && <span className="text-xs text-slate-500">Загрузка...</span>}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs text-slate-500">Страны</div>
                  <div className="flex flex-wrap gap-2">
                    {countries.map((c) => {
                      const active = params.getAll('countries').includes(String(c.id))
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            const current = new Set(params.getAll('countries'))
                            if (active) current.delete(String(c.id))
                            else current.add(String(c.id))
                            updateUrl({ countries: Array.from(current), page: 1 })
                          }}
                          className={`rounded px-2 py-1 text-xs ${active ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
                        >
                          {c.name}
                        </button>
                      )
                    })}
                    {!countries.length && <span className="text-xs text-slate-500">Загрузка...</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-sm text-slate-500">Загрузка фильтров...</div>
            )}
          </div>
        )}

        <div
          className={
            view === 'grid'
              ? 'col-span-1 lg:col-span-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
              : 'col-span-1 lg:col-span-3 flex flex-col gap-3'
          }
        >
          {loading && <div className="col-span-full text-center text-slate-500">Загрузка каталога...</div>}
          {!loading && data && data.data.length === 0 && (
            <div className="col-span-full text-center text-slate-500">{emptyMessage || 'Ничего не найдено'}</div>
          )}
          {data?.data.map((film) => (
            <FilmCard key={film.id} film={film} onChange={handleFilmChange} />
          ))}
        </div>
      </div>

      {data && data.meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: data.meta.last_page }).map((_, i) => {
            const page = i + 1
            const active = page === data.meta.current_page
            return (
              <button
                key={page}
                className={`rounded px-3 py-1 text-sm ${active ? 'bg-slate-900 text-white' : 'bg-slate-200 dark:bg-slate-700 dark:text-white'}`}
                onClick={() => updateUrl({ page })}
              >
                {page}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

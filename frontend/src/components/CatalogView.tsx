'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LayoutGrid, List, SlidersHorizontal, Sparkles, ArrowRight } from 'lucide-react'
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">Каталог V3</p>
          <h1 className="text-2xl font-bold text-white md:text-3xl">{title || 'Каталог фильмов'}</h1>
          <p className="text-sm text-slate-300">Адаптация утверждённого прототипа с мягкими градиентами и липкими фильтрами.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200">
          <span className="rounded-full bg-emerald-500/20 px-2 py-1 font-semibold text-emerald-100">Ambient</span>
          <span className="rounded-full bg-white/10 px-2 py-1">Sticky layout</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
        {filtersOpen && (
          <aside className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-soft-xl backdrop-blur lg:sticky lg:top-24">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <SlidersHorizontal size={16} />
                Фильтры
              </div>
              <button className="text-xs text-emerald-200 hover:text-emerald-100" onClick={() => updateUrl({ year_min: null, year_max: null, genres: [], countries: [], page: 1 })}>
                Сбросить
              </button>
            </div>
            {filters ? (
              <div className="space-y-4 text-sm">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">Годы</div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="w-1/2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                      placeholder={yearMin ? `${yearMin}` : 'мин'}
                      defaultValue={params.get('year_min') || ''}
                      onBlur={(e) => updateUrl({ year_min: e.target.value || null, page: 1 })}
                    />
                    <input
                      type="number"
                      className="w-1/2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                      placeholder={yearMax ? `${yearMax}` : 'макс'}
                      defaultValue={params.get('year_max') || ''}
                      onBlur={(e) => updateUrl({ year_max: e.target.value || null, page: 1 })}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">Жанры</div>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((g) => {
                      const activeGenre = params.getAll('genres').includes(String(g.id))
                      return (
                        <button
                          key={g.id}
                          onClick={() => {
                            const current = new Set(params.getAll('genres'))
                            if (activeGenre) {
                              current.delete(String(g.id))
                            } else {
                              current.add(String(g.id))
                            }
                            updateUrl({ genres: Array.from(current), page: 1 })
                          }}
                          className={`rounded-full px-3 py-1 text-xs transition ${
                            activeGenre ? 'bg-emerald-500/20 text-emerald-50 border border-emerald-300/30' : 'bg-white/5 text-slate-200 border border-white/10'
                          }`}
                        >
                          {g.name}
                        </button>
                      )
                    })}
                    {!genres.length && <span className="text-xs text-slate-500">Загрузка...</span>}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">Страны</div>
                  <div className="flex flex-wrap gap-2">
                    {countries.map((c) => {
                      const activeCountry = params.getAll('countries').includes(String(c.id))
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            const current = new Set(params.getAll('countries'))
                            if (activeCountry) {
                              current.delete(String(c.id))
                            } else {
                              current.add(String(c.id))
                            }
                            updateUrl({ countries: Array.from(current), page: 1 })
                          }}
                          className={`rounded-full px-3 py-1 text-xs transition ${
                            activeCountry ? 'bg-indigo-500/20 text-indigo-50 border border-indigo-300/40' : 'bg-white/5 text-slate-200 border border-white/10'
                          }`}
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
              <div className="text-xs text-slate-500">Загрузка фильтров...</div>
            )}
          </aside>
        )}

        <section className="space-y-4">
          <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-soft-xl md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <input
                className="w-full min-w-[240px] flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-white placeholder:text-slate-400"
                placeholder="Поиск по названию"
                defaultValue={params.get('q') || ''}
                onBlur={(e) => updateUrl({ q: e.target.value, page: 1 })}
              />
              <select
                className="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white"
                value={params.get('sort') || (scope === 'my_ratings' ? 'my_rating' : 'name')}
                onChange={(e) => updateUrl({ sort: e.target.value })}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white"
                onClick={() => setFiltersOpen((prev) => !prev)}
              >
                <SlidersHorizontal size={16} />
                {filtersOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`flex items-center gap-1 rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                  view === 'grid' ? 'bg-white text-slate-900 shadow-soft-xl' : 'bg-white/10 text-slate-200'
                }`}
                onClick={() => setView('grid')}
                aria-label="Сетка"
              >
                <LayoutGrid size={16} />
                Сетка
              </button>
              <button
                className={`flex items-center gap-1 rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                  view === 'list' ? 'bg-white text-slate-900 shadow-soft-xl' : 'bg-white/10 text-slate-200'
                }`}
                onClick={() => setView('list')}
                aria-label="Список"
              >
                <List size={16} />
                Список
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-300">
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5">
              <Sparkles size={14} className="text-emerald-200" />
              Найдено: {data?.meta?.total ?? '—'}
            </div>
            <button
              className="inline-flex items-center gap-2 text-xs text-emerald-200 hover:text-emerald-100"
              onClick={() => router.refresh()}
            >
              Обновить
              <ArrowRight size={14} />
            </button>
          </div>

          {loading && <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Загрузка...</div>}

          {!loading && data?.data && data.data.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
              {emptyMessage || 'Ничего не найдено по фильтрам.'}
            </div>
          )}

          <div className={view === 'grid' ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
            {data?.data?.map((film) => (
              <FilmCard key={film.id} film={film} onChange={handleFilmChange} view={view} />
            ))}
          </div>

          {data?.meta && data.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 text-sm text-slate-200">
              {Array.from({ length: data.meta.last_page }).map((_, idx) => {
                const page = idx + 1
                const activePage = data.meta.current_page === page
                return (
                  <button
                    key={page}
                    onClick={() => updateUrl({ page })}
                    className={`h-9 w-9 rounded-full border transition ${
                      activePage ? 'border-white bg-white text-slate-900 shadow-soft-xl' : 'border-white/10 bg-white/5 text-slate-200'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

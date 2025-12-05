'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Film,
  fetchFilm,
  markWatched,
  removeRating,
  saveNote,
  setRating,
  toggleFavorite,
  toggleWatchLater,
} from '../../../../lib/api/films'
import { Heart, Clock4, Sparkles } from 'lucide-react'

export default function FilmDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const filmId = useMemo(() => Number(params.id), [params.id])
  const [film, setFilm] = useState<Film | null>(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')
  const [noteSaving, setNoteSaving] = useState(false)
  const [needRatingPrompt, setNeedRatingPrompt] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await fetchFilm(filmId)
        if (!mounted) return
        setFilm(data)
        setNote(data.my_note || '')
      } catch (e) {
        console.error(e)
        router.replace('/app/films')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [filmId, router])

  useEffect(() => {
    if (!film) return
    const handle = setTimeout(async () => {
      setNoteSaving(true)
      try {
        await saveNote(film.id, note)
      } finally {
        setNoteSaving(false)
      }
    }, 500)
    return () => clearTimeout(handle)
  }, [note, film])

  const blocked = film?.blocked

  const handleRating = async (value: number | null) => {
    if (!film || blocked) return
    setFilm({ ...film, my_rating: value })
    if (value === null) {
      await removeRating(film.id)
    } else {
      await setRating(film.id, value)
    }
    setNeedRatingPrompt(false)
  }

  const handleFavorite = async () => {
    if (!film || blocked) return
    const next = { ...film, is_favorite: !film.is_favorite }
    setFilm(next)
    await toggleFavorite(film.id, next.is_favorite)
  }

  const handleWatchLater = async () => {
    if (!film || blocked) return
    const next = { ...film, is_watch_later: !film.is_watch_later }
    setFilm(next)
    await toggleWatchLater(film.id, next.is_watch_later)
  }

  const handleWatched = async () => {
    if (!film || blocked) return
    const resp = await markWatched(film.id)
    setFilm({ ...film, is_watch_later: false, is_watched: true })
    if (resp.need_rating) setNeedRatingPrompt(true)
  }

  if (loading || !film) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="relative h-[420px] bg-slate-900">
            {film.poster_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={film.poster_url} alt={film.title} className={`h-full w-full object-cover ${blocked ? 'blur-sm' : ''}`} />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300">Нет постера</div>
            )}
            {film.is_18_plus && <span className="absolute left-3 top-3 rounded bg-red-600 px-2 py-1 text-xs text-white">18+</span>}
            {blocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 text-center text-sm text-white">
                Контент ограничен по возрасту
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold leading-tight">{film.title}</h1>
              {film.original_title && <span className="text-sm text-slate-500">{film.original_title}</span>}
            </div>
            <p className="text-sm text-slate-500">
              {film.year} • {film.duration_min ? `${film.duration_min} мин` : '—'} • {film.director || 'режиссер не указан'}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
              {film.genres.map((g) => (
                <span key={g.id} className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">
                  {g.name}
                </span>
              ))}
              {film.countries.map((c) => (
                <span key={c.id} className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          <p className="text-base text-slate-700 dark:text-slate-200">
            {blocked ? 'Описание скрыто для вашего возраста' : film.description || 'Описание недоступно'}
          </p>

          <div className="flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
            <div className="text-sm text-slate-600 dark:text-slate-200">Средний рейтинг: ★ {film.avg_rating.toFixed(1)}</div>
            <div className="text-sm text-slate-600 dark:text-slate-200">Мой рейтинг: {film.my_rating ?? '—'}</div>
            <div className="ml-auto flex flex-wrap gap-2">
              <button
                onClick={handleFavorite}
                disabled={blocked}
                className={`flex items-center gap-2 rounded px-3 py-2 text-sm ${film.is_favorite ? 'bg-pink-200 text-pink-800' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-100'} ${blocked ? 'opacity-60' : ''}`}
              >
                <Heart size={16} /> Избранное
              </button>
              <button
                onClick={handleWatchLater}
                disabled={blocked}
                className={`flex items-center gap-2 rounded px-3 py-2 text-sm ${film.is_watch_later ? 'bg-amber-200 text-amber-900' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-100'} ${blocked ? 'opacity-60' : ''}`}
              >
                <Clock4 size={16} /> Позже
              </button>
              <button
                onClick={handleWatched}
                disabled={blocked}
                className={`flex items-center gap-2 rounded bg-emerald-600 px-3 py-2 text-sm text-white ${blocked ? 'opacity-60' : ''}`}
              >
                <Sparkles size={16} /> Посмотрел
              </button>
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Моя заметка</div>
            <textarea
              className="h-32 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Добавьте личные мысли и заметки"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={blocked}
            />
            <div className="mt-1 text-xs text-slate-500">{noteSaving ? 'Сохранение...' : 'Автосохранение каждые 0.5 сек'}</div>
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Мой рейтинг</div>
            <div className="flex flex-wrap gap-2">
              {[...Array(10).keys()].map((i) => {
                const value = i + 1
                const active = film.my_rating ? film.my_rating >= value : false
                return (
                  <button
                    key={value}
                    onClick={() => handleRating(value)}
                    onDoubleClick={() => handleRating(null)}
                    disabled={blocked}
                    className={`h-8 w-8 rounded-full text-xs font-semibold ${active ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-100'} ${blocked ? 'opacity-60' : ''}`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
            {needRatingPrompt && (
              <div className="mt-2 text-sm text-amber-600">Поставьте оценку, чтобы рекомендациям было проще.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

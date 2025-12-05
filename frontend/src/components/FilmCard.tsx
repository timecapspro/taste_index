'use client'

import { Film, removeRating, setRating, toggleFavorite, toggleWatchLater } from '../lib/api/films'
import { useState } from 'react'
import { Heart, Clock4 } from 'lucide-react'

export default function FilmCard({ film, onChange }: { film: Film; onChange: (next: Film) => void }) {
  const [loading, setLoading] = useState(false)

  const handleRating = async (value: number | null) => {
    if (loading) return
    setLoading(true)
    try {
      if (value === null) {
        await removeRating(film.id)
        onChange({ ...film, my_rating: null })
      } else {
        await setRating(film.id, value)
        onChange({ ...film, my_rating: value })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async () => {
    if (loading) return
    setLoading(true)
    try {
      await toggleFavorite(film.id, !film.is_favorite)
      onChange({ ...film, is_favorite: !film.is_favorite })
    } finally {
      setLoading(false)
    }
  }

  const handleWatchLater = async () => {
    if (loading) return
    setLoading(true)
    try {
      await toggleWatchLater(film.id, !film.is_watch_later)
      onChange({ ...film, is_watch_later: !film.is_watch_later })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="relative h-48 overflow-hidden rounded-t-lg bg-slate-800">
        {film.poster_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={film.poster_url} alt={film.title} className={`h-full w-full object-cover ${film.blocked ? 'blur-sm' : ''}`} />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">Нет постера</div>
        )
        {film.is_18_plus && <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs text-white">18+</span>}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{film.title}</h3>
            <p className="text-sm text-slate-500">
              {film.year} • {film.duration_min ? `${film.duration_min} мин` : '—'}
            </p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <div>★ {film.avg_rating.toFixed(1)}</div>
            <div className="text-xs">моя: {film.my_rating ?? '—'}</div>
          </div>
        </div>
        <p className="h-16 overflow-hidden text-sm text-slate-600 dark:text-slate-300">{film.description || 'Описание недоступно'}</p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
          {film.genres.map((g) => (
            <span key={g.id} className="rounded bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
              {g.name}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={handleFavorite}
              className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${film.is_favorite ? 'bg-pink-200 text-pink-700' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
            >
              <Heart size={14} /> Избранное
            </button>
            <button
              onClick={handleWatchLater}
              className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${film.is_watch_later ? 'bg-amber-200 text-amber-800' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
            >
              <Clock4 size={14} /> Позже
            </button>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(10).keys()].map((i) => {
              const value = i + 1
              const active = film.my_rating ? film.my_rating >= value : false
              return (
                <button
                  key={value}
                  onClick={() => handleRating(value)}
                  onDoubleClick={() => handleRating(null)}
                  className={`h-5 w-5 rounded-full text-[10px] ${active ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

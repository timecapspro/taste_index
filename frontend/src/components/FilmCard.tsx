'use client'

import Link from 'next/link'
import { Film, removeRating, setRating, toggleFavorite, toggleWatchLater } from '../lib/api/films'
import { useState } from 'react'
import { Heart, Clock4, Star, Info, Sparkles } from 'lucide-react'

type Props = {
  film: Film
  onChange: (next: Film) => void
  view?: 'grid' | 'list'
}

export default function FilmCard({ film, onChange, view = 'grid' }: Props) {
  const [loading, setLoading] = useState(false)
  const blocked = film.blocked

  const handleRating = async (value: number | null) => {
    if (loading || blocked) return
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
    if (loading || blocked) return
    setLoading(true)
    try {
      await toggleFavorite(film.id, !film.is_favorite)
      onChange({ ...film, is_favorite: !film.is_favorite })
    } finally {
      setLoading(false)
    }
  }

  const handleWatchLater = async () => {
    if (loading || blocked) return
    setLoading(true)
    try {
      await toggleWatchLater(film.id, !film.is_watch_later)
      onChange({ ...film, is_watch_later: !film.is_watch_later })
    } finally {
      setLoading(false)
    }
  }

  const ratingBadges = (
    <div className="flex items-center gap-2 text-xs text-slate-200">
      <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
        <Star size={14} className="text-amber-300" />
        {film.avg_rating.toFixed(1)}
      </div>
      <div className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-slate-300">
        <Sparkles size={14} className="text-emerald-200" />
        {film.my_rating ? `моя: ${film.my_rating}` : 'нет оценки'}
      </div>
    </div>
  )

  return (
    <div
      className={`group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-soft-xl backdrop-blur transition hover:-translate-y-1 hover:border-white/20 ${
        view === 'list' ? 'flex gap-4' : ''
      }`}
    >
      <div className={`relative ${view === 'list' ? 'h-48 w-40 flex-shrink-0' : 'h-56'} overflow-hidden rounded-2xl bg-slate-800`}>
        {film.poster_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={film.poster_url} alt={film.title} className={`h-full w-full object-cover ${blocked ? 'blur-sm' : ''}`} />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400">
            Нет постера
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
        {film.is_18_plus && <span className="absolute left-2 top-2 rounded-full bg-red-600/90 px-2 py-0.5 text-[11px] font-semibold text-white">18+</span>}
        {blocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 text-sm text-white">Возрастное ограничение</div>
        )}
      </div>

      <div className="flex-1 space-y-3 p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <Link href={`/app/films/${film.id}`} className="text-lg font-semibold leading-tight text-white hover:text-emerald-200">
              {film.title}
            </Link>
            <p className="text-sm text-slate-300">
              {film.year} • {film.duration_min ? `${film.duration_min} мин` : '—'}
            </p>
          </div>
          {ratingBadges}
        </div>

        <p className="line-clamp-3 text-sm text-slate-200/90">
          {blocked ? 'Контент скрыт для вашего возраста' : film.description || 'Описание недоступно'}
        </p>

        <div className="flex flex-wrap gap-2 text-xs text-slate-200">
          {film.genres.map((g) => (
            <span key={g.id} className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
              {g.name}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleFavorite}
              disabled={blocked || loading}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                film.is_favorite ? 'bg-pink-500/20 text-pink-100 border border-pink-200/40' : 'bg-white/5 text-slate-200 border border-white/10'
              } ${blocked || loading ? 'opacity-50' : ''}`}
            >
              <Heart size={14} /> Избранное
            </button>
            <button
              onClick={handleWatchLater}
              disabled={blocked || loading}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                film.is_watch_later ? 'bg-amber-400/20 text-amber-100 border border-amber-200/40' : 'bg-white/5 text-slate-200 border border-white/10'
              } ${blocked || loading ? 'opacity-50' : ''}`}
            >
              <Clock4 size={14} /> Позже
            </button>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-300">
            <Info size={14} />
            Двойной клик по оценке сбрасывает её
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 10 }, (_, i) => {
            const value = i + 1
            const active = film.my_rating ? film.my_rating >= value : false
            return (
              <button
                key={value}
                onClick={() => handleRating(value)}
                onDoubleClick={() => handleRating(null)}
                disabled={blocked || loading}
                className={`h-7 w-7 rounded-full text-[11px] font-semibold transition ${
                  active ? 'bg-amber-400 text-slate-900 shadow-soft-xl' : 'bg-white/5 text-slate-200 border border-white/10'
                } ${blocked || loading ? 'opacity-50' : 'hover:bg-white/20'}`}
              >
                {value}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

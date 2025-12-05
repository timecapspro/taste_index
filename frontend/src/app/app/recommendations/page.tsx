'use client'

import { useEffect, useState } from 'react'
import { fetchRecommendations, RecommendationResponse } from '../../../lib/api/recommendations'
import FilmCard from '../../../components/FilmCard'
import { Film } from '../../../lib/api/films'

export default function RecommendationsPage() {
  const [data, setData] = useState<RecommendationResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchRecommendations()
      .then((res) => setData(res))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-4 text-slate-500">Загрузка рекомендаций...</div>
  }

  if (!data) {
    return <div className="p-4 text-slate-500">Не удалось загрузить рекомендации</div>
  }

  if (data.need_more_ratings) {
    const popularList = data.data || []
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900 dark:bg-amber-900/30">
          <h2 className="text-lg font-semibold">Оцените больше фильмов</h2>
          <p className="text-sm">Мы покажем персональные рекомендации после 10 оценок. Выберите понравившиеся и поставьте оценку прямо здесь.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {popularList.map((film) => (
            <FilmCard
              key={film.id}
              film={film}
              onChange={(f) => setData({ ...data, data: popularList.map((x) => (x.id === f.id ? f : x)) })}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Рекомендации</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((film) => (
          <FilmCard
            key={film.id}
            film={film}
            onChange={(f) => setData({ ...data, data: data.data.map((x) => (x.id === f.id ? f : x)) })}
          />
        ))}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchUser, UserDetailResponse, UserRatingItem } from '../../../../lib/api/users'
import { Loader2 } from 'lucide-react'

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = Number(params?.id)
  const [info, setInfo] = useState<UserDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    fetchUser(userId, { page, per_page: 12 })
      .then((res) => {
        setInfo(res)
        setPages(res.ratings.meta.last_page)
      })
      .catch(() => router.push('/app/users'))
      .finally(() => setLoading(false))
  }, [userId, page, router])

  const ratings = info?.ratings.data ?? []

  return (
    <div className="space-y-4">
      <Link href="/app/users" className="text-sm text-slate-500 underline">
        ← Назад к пользователям
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{info?.user.login}</h1>
          <p className="text-sm text-slate-500">Совпадение вкусов: {info?.user.match_percent}%</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : ratings.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900">
          Пользователь пока не оценивал фильмы
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ratings.map((item: UserRatingItem) => (
            <Link
              key={item.id}
              href={`/app/films/${item.film.id}`}
              className="relative rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg bg-slate-800">
                {item.film.poster_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.film.poster_url} alt={item.film.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">Нет постера</div>
                )}
                <span className="absolute left-2 top-2 rounded bg-emerald-600 px-2 py-0.5 text-xs text-white">Оценка: {item.rating}</span>
              </div>
              <div className="p-4">
                <div className="text-lg font-semibold">{item.film.title}</div>
                <div className="text-sm text-slate-500">{item.film.year}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
                  {item.film.genres.map((g) => (
                    <span key={g.id} className="rounded bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-2">
        <button
          className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Назад
        </button>
        <span className="text-sm text-slate-600 dark:text-slate-300">
          Страница {page} из {pages}
        </span>
        <button
          className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
          disabled={page >= pages}
        >
          Вперёд
        </button>
      </div>
    </div>
  )
}

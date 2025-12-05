'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchUsers, UserSummary } from '../../../lib/api/users'
import { Loader2 } from 'lucide-react'

export default function UsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  useEffect(() => {
    setLoading(true)
    fetchUsers({ page, per_page: 12 })
      .then((res) => {
        setUsers(res.data)
        setPages(res.meta.last_page)
      })
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Пользователи</h1>
          <p className="text-sm text-slate-500">Сортировка по совпадению вкусов</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900">
          Пользователи не найдены
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="text-lg font-semibold">{u.login}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">Совпадение</div>
                <div className="text-2xl font-bold text-emerald-600">{u.match_percent}%</div>
                <Link href={`/app/users/${u.id}`} className="text-sm text-slate-900 underline dark:text-slate-100">
                  Смотреть оценки
                </Link>
              </div>
            </div>
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

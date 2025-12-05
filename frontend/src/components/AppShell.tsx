'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, ReactNode } from 'react'
import { Search, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import { fetchMeStats, MeStats } from '../lib/api/stats'
import { Film, fetchFilms } from '../lib/api/films'

const navItems = [
  { href: '/app/films', label: 'Фильмы' },
  { href: '/app/recommendations', label: 'Рекомендации' },
  { href: '/app/favorites', label: 'Избранное' },
  { href: '/app/watch-later', label: 'Смотреть позже' },
  { href: '/app/my-ratings', label: 'Мои оценки' },
  { href: '/app/users', label: 'Пользователи' },
]

type Suggestion = Pick<Film, 'id' | 'title' | 'year'>

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<MeStats | null>(null)
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [showCookie, setShowCookie] = useState(false)

  useEffect(() => {
    fetchMeStats().then(setStats).catch(() => null)
    setShowCookie(localStorage.getItem('ti_cookie') !== '1')
  }, [])

  useEffect(() => {
    if (search.length < 2) {
      setSuggestions([])
      return
    }
    fetchFilms({ q: search, per_page: 5 })
      .then((res) => {
        setSuggestions(res.data.map((f) => ({ id: f.id, title: f.title, year: f.year })))
      })
      .catch(() => null)
  }, [search])

  const active = useMemo(() => pathname || '', [pathname])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/app/films?q=${encodeURIComponent(search)}&page=1`)
    setSuggestions([])
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Меню">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/app/films" className="font-bold">
            ИндексВкуса
          </Link>
          <form onSubmit={handleSearchSubmit} className="relative hidden flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm md:flex dark:border-slate-800 dark:bg-slate-800">
            <Search size={16} className="text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
              placeholder="Поиск фильмов"
            />
            {suggestions.length > 0 && (
              <div className="absolute left-0 top-10 w-full rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => {
                      router.push(`/app/films?q=${encodeURIComponent(s.title)}&page=1`)
                      setSuggestions([])
                    }}
                  >
                    <span>{s.title}</span>
                    <span className="text-xs text-slate-500">{s.year}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <div className="relative group">
              <button className="rounded-full bg-slate-800 px-3 py-1 text-sm text-white">
                {user?.login ?? 'Профиль'}
              </button>
              <div className="invisible absolute right-0 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-3 text-sm opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{user?.login}</div>
                    <div className="text-xs text-slate-500">{user?.email}</div>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <div>Избр.: {stats?.favorites ?? '—'}</div>
                    <div>Оценок: {stats?.ratings ?? '—'}</div>
                  </div>
                </div>
                <div className="mb-2 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Link href="/app/me/submissions" className="underline">
                    Мои добавления
                  </Link>
                  <Link href="/app/me/notifications" className="underline">
                    Уведомления
                  </Link>
                  <Link href="/app/me/settings" className="underline">
                    Настройки
                  </Link>
                </div>
                <button onClick={logout} className="text-sm text-red-600 underline">
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
        <nav className="hidden border-t border-slate-200 bg-white text-sm md:block dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2">
            {navItems.map((item) => {
              const activeLink = active.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded px-3 py-1 ${activeLink ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-2 text-sm md:hidden dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-4 py-2 text-sm md:hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          {navItems.slice(0, 5).map((item) => {
            const activeLink = active.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-2 py-1 ${activeLink ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-700 dark:text-slate-200'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>

      {showCookie && (
        <div className="fixed bottom-4 right-4 max-w-sm rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-2 font-semibold">Мы используем куки</div>
          <p className="mb-3 text-slate-600 dark:text-slate-300">Для улучшения рекомендаций мы храним ваши действия в приложении.</p>
          <button
            className="rounded bg-slate-900 px-3 py-1 text-white dark:bg-slate-100 dark:text-slate-900"
            onClick={() => {
              localStorage.setItem('ti_cookie', '1')
              setShowCookie(false)
            }}
          >
            Понятно
          </button>
        </div>
      )}
    </div>
  )
}

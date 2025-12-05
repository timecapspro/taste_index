'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, ReactNode } from 'react'
import { Search, Menu, X, LayoutGrid, List, Sparkles, Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import { fetchMeStats, MeStats } from '../lib/api/stats'
import { Film, fetchFilms } from '../lib/api/films'

const navItems = [
  { href: '/app/films', label: 'Каталог' },
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

  const ambientGradient =
    'bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_35%,rgba(255,255,255,0.05)_70%)]';
  const ambientNoise =
    "bg-[url('data:image/svg+xml,%3Csvg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 160 160\\"%3E%3Cfilter id=\\"n\\" x=\\"-20%25\\" y=\\"-20%25\\" width=\\"140%25\\" height=\\"140%25\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.75\\" numOctaves=\\"2\\" stitchTiles=\\"stitch\\"/%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23n)\\" opacity=\\"0.14\\"/%3E%3C/svg%3E')]";

  return (
    <div className="relative min-h-screen bg-ambient-gradient text-slate-100">
      <div className={`pointer-events-none fixed inset-0 ${ambientGradient} opacity-40`} />
      <div className={`pointer-events-none fixed inset-0 ${ambientNoise}`} />

      <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-900/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-4 py-3">
          <button className="md:hidden rounded-full border border-white/10 p-2" onClick={() => setMenuOpen((v) => !v)} aria-label="Меню">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link href="/app/films" className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-sm font-semibold tracking-tight shadow-soft-xl">
            <Sparkles size={16} className="text-emerald-300" />
            ИндексВкуса
          </Link>

          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm shadow-soft-xl md:flex"
          >
            <Search size={16} className="text-slate-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent placeholder:text-slate-400 focus:outline-none"
              placeholder="Поиск фильмов"
            />
            {suggestions.length > 0 && (
              <div className="absolute left-0 top-12 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-white/5"
                    onClick={() => {
                      router.push(`/app/films?q=${encodeURIComponent(s.title)}&page=1`)
                      setSuggestions([])
                    }}
                  >
                    <span>{s.title}</span>
                    <span className="text-xs text-slate-400">{s.year}</span>
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="ml-auto flex items-center gap-2">
            <button className="hidden items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-200/90 md:flex">
              <Bell size={14} />
              Уведомления
            </button>
            <ThemeToggle />
            <div className="relative group hidden md:block">
              <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold uppercase">
                  {user?.login?.slice(0, 2) || 'TI'}
                </div>
                <div className="text-left">
                  <div className="leading-none">{user?.login ?? 'Профиль'}</div>
                  <div className="text-[11px] text-slate-400">{user?.email ?? 'Аккаунт'}</div>
                </div>
                <ChevronDown size={14} className="text-slate-300" />
              </button>
              <div className="invisible absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-slate-900/95 p-4 text-sm shadow-2xl opacity-0 transition group-hover:visible group-hover:opacity-100">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">{user?.login}</div>
                    <div className="text-xs text-slate-400">{user?.email}</div>
                  </div>
                  <div className="rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-300">
                    <div>Избр.: {stats?.favorites ?? '—'}</div>
                    <div>Оценок: {stats?.ratings ?? '—'}</div>
                  </div>
                </div>
                <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <Link href="/app/me/submissions" className="rounded-lg bg-white/5 px-3 py-2 hover:bg-white/10">
                    Мои добавления
                  </Link>
                  <Link href="/app/me/notifications" className="rounded-lg bg-white/5 px-3 py-2 hover:bg-white/10">
                    Уведомления
                  </Link>
                  <Link href="/app/me/settings" className="rounded-lg bg-white/5 px-3 py-2 hover:bg-white/10">
                    Настройки
                  </Link>
                  <button onClick={logout} className="rounded-lg bg-red-500/10 px-3 py-2 text-red-200 hover:bg-red-500/15">
                    Выйти
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav className="border-t border-white/5 bg-slate-900/70 text-sm backdrop-blur md:block">
          <div className="mx-auto flex max-w-[1320px] items-center gap-2 px-4 py-2">
            {navItems.map((item) => {
              const activeLink = active.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 transition ${
                    activeLink ? 'bg-white text-slate-900 shadow-soft-xl' : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="border-b border-white/5 bg-slate-900/90 px-4 py-3 text-sm md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 hover:bg-white/10">
                {item.label}
              </Link>
            ))}
            <button onClick={logout} className="rounded-lg px-3 py-2 text-left text-red-300 hover:bg-red-500/10">
              Выйти
            </button>
          </div>
        </div>
      )}

      <main className="relative z-10 mx-auto max-w-[1320px] px-4 pb-16 pt-8">
        <div className="mb-4 flex items-center gap-3 text-sm text-slate-300">
          <span className="rounded-full bg-white/5 px-3 py-1 font-medium text-white">V3 Prototype Shell</span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-200">Ambient</span>
          <span className="rounded-full bg-white/5 px-3 py-1 text-slate-200">Sticky header/nav</span>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-4 shadow-soft-xl backdrop-blur">{children}</div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-slate-900/90 px-4 py-3 text-sm backdrop-blur md:hidden">
        <div className="flex items-center justify-between">
          {[
            { label: 'Каталог', href: '/app/films', icon: <LayoutGrid size={16} /> },
            { label: 'Избранное', href: '/app/favorites', icon: <Sparkles size={16} /> },
            { label: 'Позже', href: '/app/watch-later', icon: <ClockIcon /> },
            { label: 'Оценки', href: '/app/my-ratings', icon: <StarIcon /> },
          ].map((item) => {
            const activeLink = active.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 rounded-full px-3 py-1 ${
                  activeLink ? 'bg-white text-slate-900 shadow-soft-xl' : 'text-slate-200'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>

      {showCookie && (
        <div className="fixed bottom-4 right-4 z-30 max-w-sm rounded-2xl border border-white/10 bg-slate-900/90 p-4 text-sm shadow-2xl backdrop-blur">
          <div className="mb-2 font-semibold text-white">Мы используем куки</div>
          <p className="mb-3 text-slate-300">Для улучшения рекомендаций мы храним ваши действия в приложении.</p>
          <button
            className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-soft-xl"
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

function ClockIcon() {
  return <div className="h-4 w-4 rounded-full border border-white/60" />
}

function StarIcon() {
  return <div className="h-4 w-4 rounded-full border border-yellow-400 bg-yellow-400/40" />
}

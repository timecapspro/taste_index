'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-900 text-slate-100 shadow">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg">
          ИндексВкуса
        </Link>
        <nav className="flex gap-3 text-sm">
          <Link href="/features" className="hover:underline">
            Возможности
          </Link>
          <Link href="/login" className="hover:underline">
            Вход
          </Link>
          <Link href="/register" className="hover:underline">
            Регистрация
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {user ? (
          <button onClick={logout} className="text-sm underline">
            Выйти ({user.login})
          </button>
        ) : null}
      </div>
    </header>
  )
}

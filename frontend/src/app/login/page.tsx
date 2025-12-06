'use client'

import Link from 'next/link'
import { FormEvent, Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '../../components/Header'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-300">Загрузка...</div>}>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loginOrEmail, setLoginOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login({ login_or_email: loginOrEmail, password })
      const redirect = searchParams.get('redirect') || '/app/films'
      if (!res.emailVerified) {
        router.replace('/verify-email')
      } else {
        router.replace(redirect)
      }
    } catch (err: any) {
      if (err.code === 'EMAIL_NOT_VERIFIED') {
        router.replace('/verify-email')
      } else {
        setError(err.message || 'Ошибка входа')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <main className="max-w-md mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Вход</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="block text-sm text-slate-300">Логин или email</label>
            <input
              value={loginOrEmail}
              onChange={(e) => setLoginOrEmail(e.target.value)}
              required
              className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm text-slate-300">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-indigo-600 px-3 py-2 font-semibold hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>
        <div className="text-sm text-slate-300 space-y-1">
          <p>
            Нет аккаунта?{' '}
            <Link href="/register" className="underline">
              Зарегистрироваться
            </Link>
          </p>
          <p>
            <Link href="/forgot-password" className="underline">
              Забыли пароль?
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

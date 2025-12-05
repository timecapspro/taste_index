'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { resendVerification } from '../../lib/api/auth'
import { useAuth } from '../../context/AuthContext'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const { user, loading, refresh } = useAuth()
  const [seconds, setSeconds] = useState(120)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleResend = async () => {
    setError('')
    setMessage('')
    if (seconds > 0) return
    try {
      const res = await resendVerification()
      setMessage(res.message || 'Письмо отправлено')
      setSeconds(120)
      await refresh()
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки')
    }
  }

  return (
    <div>
      <Header />
      <main className="max-w-xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Подтвердите email</h1>
        <p className="text-slate-300">Мы отправили письмо с ссылкой. Без подтверждения доступ к приложению ограничен.</p>
        <div className="rounded border border-slate-700 p-4 space-y-2">
          <p className="text-sm text-slate-200">Текущий пользователь: {user?.email || 'нет'}</p>
          {loading && <p>Проверяем статус...</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={handleResend}
            disabled={seconds > 0}
            className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"
          >
            Отправить повторно {seconds > 0 ? `(${seconds}с)` : ''}
          </button>
        </div>
        <Link href="/login" className="underline text-sm">
          Вернуться к входу
        </Link>
      </main>
    </div>
  )
}

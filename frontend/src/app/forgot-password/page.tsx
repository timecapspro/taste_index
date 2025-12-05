'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import Header from '../../components/Header'
import { sendForgotPassword } from '../../lib/api/auth'

export default function ForgotPasswordPage() {
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await sendForgotPassword(value)
      setMessage(res.message || 'Ссылка отправлена (проверьте логи mail)')
    } catch (err: any) {
      setError(err.message || 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <main className="max-w-md mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Восстановление пароля</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm text-slate-300">Логин или email</label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2"
          />
          {message && <p className="text-green-400 text-sm">{message}</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-indigo-600 px-3 py-2 font-semibold hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? 'Отправляем...' : 'Отправить ссылку'}
          </button>
        </form>
        <Link href="/login" className="underline text-sm">
          Вернуться к входу
        </Link>
      </main>
    </div>
  )
}

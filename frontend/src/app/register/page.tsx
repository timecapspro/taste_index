'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    login: '',
    password: '',
    password_confirmation: '',
    birth_date: '',
    language: 'ru',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(form)
      router.replace('/verify-email')
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <main className="max-w-md mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Регистрация</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Email" value={form.email} onChange={(email) => setForm({ ...form, email })} type="email" />
          <Input label="Логин" value={form.login} onChange={(login) => setForm({ ...form, login })} />
          <Input
            label="Дата рождения"
            value={form.birth_date}
            onChange={(birth_date) => setForm({ ...form, birth_date })}
            type="date"
          />
          <Input
            label="Пароль"
            type="password"
            value={form.password}
            onChange={(password) => setForm({ ...form, password })}
          />
          <Input
            label="Подтверждение пароля"
            type="password"
            value={form.password_confirmation}
            onChange={(password_confirmation) => setForm({ ...form, password_confirmation })}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-indigo-600 px-3 py-2 font-semibold hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? 'Создаём...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="text-sm text-slate-300">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="underline">
            Войти
          </Link>
        </p>
      </main>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm text-slate-300">{label}</label>
      <input
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2"
      />
    </div>
  )
}

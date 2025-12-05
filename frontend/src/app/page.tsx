import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-900 text-white">
      <h1 className="text-4xl font-bold">ИндексВкуса</h1>
      <p className="text-center max-w-2xl text-slate-200">
        Монорепозиторий с Next.js и Laravel API. Этот MVP включает авторизацию, каталог фильмов,
        избранное и рекомендации. Стек и UX соответствуют прототипу ui.jsx.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="rounded-md bg-white text-slate-900 px-4 py-2 font-semibold">Войти</Link>
        <Link href="/register" className="rounded-md border border-white px-4 py-2 font-semibold">Регистрация</Link>
      </div>
    </main>
  )
}

import Header from '../components/Header'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto py-16 px-4 space-y-6">
        <h1 className="text-4xl font-bold">ИндексВкуса — персональные рекомендации по фильмам</h1>
        <p className="text-lg text-slate-300">
          Оценивайте фильмы, ведите списки “Избранное” и “Смотреть позже”, получайте рекомендации по совпадению
          вкусов.
        </p>
        <div className="flex gap-4">
          <Link
            href="/register"
            className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
          >
            Начать
          </Link>
          <Link href="/features" className="rounded border border-slate-600 px-4 py-2 hover:bg-slate-800">
            Узнать больше
          </Link>
        </div>
      </main>
    </div>
  )
}

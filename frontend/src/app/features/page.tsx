import Header from '../../components/Header'

const items = [
  'Каталог фильмов с фильтрами и сортировками',
  'Оценки 1..10 и персональные рекомендации',
  'Списки избранного и “смотреть позже”',
  'Подтверждение email и защита данных',
]

export default function FeaturesPage() {
  return (
    <div>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        <h1 className="text-3xl font-bold">Возможности</h1>
        <ul className="space-y-2 list-disc list-inside text-slate-200">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </main>
    </div>
  )
}

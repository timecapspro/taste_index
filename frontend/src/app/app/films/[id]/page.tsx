import IndexVkusV3 from '@/components/prototype/IndexVkusV3'

export default function FilmDetailPage({ params }: { params: { id: string } }) {
  return <IndexVkusV3 initialRoute="filmDetail" initialParam={params.id} />
}

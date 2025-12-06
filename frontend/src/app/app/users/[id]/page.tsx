import IndexVkusV3 from '@/components/prototype/IndexVkusV3'

export default function UserProfilePage({ params }: { params: { id: string } }) {
  return <IndexVkusV3 initialRoute="userProfile" initialParam={params.id} />
}

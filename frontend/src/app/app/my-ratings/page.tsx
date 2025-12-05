import CatalogView from '../../../components/CatalogView'

export default function MyRatingsPage() {
  return (
    <CatalogView
      scope="my_ratings"
      title="Мои оценки"
      emptyMessage="Оцените фильмы, чтобы увидеть список"
    />
  )
}

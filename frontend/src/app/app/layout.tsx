import ProtectedRoute from '../../components/ProtectedRoute'
import Header from '../../components/Header'
import type { ReactNode } from 'react'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <ProtectedRoute>
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </ProtectedRoute>
    </div>
  )
}

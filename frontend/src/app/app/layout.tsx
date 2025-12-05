import ProtectedRoute from '../../components/ProtectedRoute'
import AppShell from '../../components/AppShell'
import type { ReactNode } from 'react'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  )
}

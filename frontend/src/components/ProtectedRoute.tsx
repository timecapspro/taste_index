'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login?redirect=' + encodeURIComponent(pathname))
      return
    }
    if (!user.email_verified_at) {
      router.replace('/verify-email')
    }
  }, [loading, user, router, pathname])

  if (loading || !user) {
    return <div className="p-6">Загрузка...</div>
  }

  if (!user.email_verified_at) {
    return <div className="p-6">Подтвердите email...</div>
  }

  return <>{children}</>
}

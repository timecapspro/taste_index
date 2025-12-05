'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { clearToken, getToken, setToken } from '../lib/auth-storage'
import { fetchMe, login as apiLogin, logout as apiLogout, register as apiRegister } from '../lib/api/auth'

export type User = {
  id: number
  email: string
  login: string
  email_verified_at: string | null
  language?: string
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (payload: { login_or_email: string; password: string }) => Promise<{ emailVerified: boolean }>
  register: (payload: {
    email: string
    login: string
    password: string
    password_confirmation: string
    birth_date?: string
    language?: string
  }) => Promise<{ emailVerified: boolean }>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    fetchMe()
      .then((data) => {
        setUser(data)
      })
      .catch(() => {
        clearToken()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleLogin: AuthContextValue['login'] = async (payload) => {
    const res = await apiLogin(payload)
    setToken(res.token)
    setUser(res.user)
    return { emailVerified: !!res.email_verified }
  }

  const handleRegister: AuthContextValue['register'] = async (payload) => {
    const res = await apiRegister(payload)
    setToken(res.token)
    setUser(res.user)
    return { emailVerified: !!res.email_verified }
  }

  const handleLogout = async () => {
    try {
      await apiLogout()
    } catch (e) {
      // ignore
    }
    clearToken()
    setUser(null)
  }

  const refresh = async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      return
    }
    const data = await fetchMe()
    setUser(data)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('AuthProvider missing')
  return ctx
}

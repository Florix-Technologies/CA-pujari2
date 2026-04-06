"use client"

import { createContext, useContext, useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  loading: boolean
  session: Session | null
  role: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchUserRole = async (userId: string) => {
      try {
        const res = await fetch(`/api/auth/role?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          return data.role || 'student'
        }
        return 'student'
      } catch (err) {
        return 'student'
      }
    }

    // get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          if (error.message.includes('Refresh Token Not Found')) {
            console.warn('Supabase session refresh failed: Refresh Token Not Found.')
          } else {
            console.error('Session error:', error.message)
          }
        }
        
        if (mounted) {
          setSession(session ?? null)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            const userRole = await fetchUserRole(session.user.id)
            if (mounted) setRole(userRole)
          } else {
            setRole(null)
          }
        }
      } catch (err) {
        console.error('Unexpected auth error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getInitialSession()

    // subscribe to changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (mounted) {
        setSession(newSession ?? null)
        setUser(newSession?.user ?? null)
        
        if (newSession?.user) {
          const userRole = await fetchUserRole(newSession.user.id)
          if (mounted) setRole(userRole)
        } else {
          setRole(null)
        }
        
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, session, role }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

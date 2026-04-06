"use client"

import { createContext, useContext, useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  loading: boolean
  session: Session | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // get initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          if (error.message.includes('Refresh Token Not Found')) {
            // Silencing noisy common dev error
            console.warn('Supabase session refresh failed: Refresh Token Not Found. This is normal if the session expired.')
          } else {
            console.error('Session error:', error.message)
          }
        }
        if (mounted) {
          setSession(data.session ?? null)
          setUser(data.session?.user ?? null)
        }
      } catch (err) {
        console.error('Unexpected auth error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getInitialSession()

    // subscribe to changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null)
      setUser(newSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      // unsubscribe listener
      // @ts-ignore
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, session }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

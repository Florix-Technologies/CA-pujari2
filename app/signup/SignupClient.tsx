"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import supabase from "@/lib/supabaseClient"
import { useTheme } from "@/hooks/useTheme"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion } from "framer-motion"

export default function SignupClient() {
  const router = useRouter()
  const { isLight } = useTheme()
  const searchParams = useSearchParams()
  const course = searchParams?.get("course")
  const redirectParam = searchParams?.get("redirect")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [agree, setAgree] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({ email, password })

      // If signup was rate-limited on email sending, fall back to server-side
      // admin create to avoid throttles (server uses service role key).
      if (error && (error.status === 429)) {
        try {
          const res = await fetch('/api/admin-create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, full_name: name }),
          })
          const json = await res.json()
          if (!res.ok) throw new Error(json?.error || json?.detail || 'admin-create-user failed')
        } catch (e: any) {
          // surface server error instead of original signup error
          throw new Error(e?.message ?? String(e))
        }
      } else if (error) {
        // other signup errors: surface to user
        throw error
      }

      const user = data?.user

      // Ensure profile exists (safe to call regardless)
      try {
        await fetch('/api/create-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, full_name: name }),
        })
      } catch (e) {
        console.warn('create-profile API failed', e)
      }

      if (redirectParam) router.push(redirectParam)
      else if (course) router.push(`/courses`)
      else router.push("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: isLight ? '#F7F2E8' : '#0F172A',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card 
          className="relative overflow-hidden rounded-3xl shadow-2xl"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
            borderColor: isLight ? '#E0D5C7' : '#334155',
          }}
        >
          {/* subtle glow */}
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />

          <CardHeader className="space-y-2">
            <CardTitle 
              className="text-2xl font-extrabold"
              style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}
            >
              Create your account
            </CardTitle>
            <CardDescription style={{ color: isLight ? '#A38970' : '#CBD5E1' }} className="text-center">
              Start learning with structure and confidence
            </CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                Back
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignup} className="flex flex-col gap-5">
              {error && (
                <p style={{ color: '#EF4444' }} className="text-sm text-center">{error}</p>
              )}

              {/* PROFILE PREVIEW */}
              <div 
                className="flex items-center gap-4 rounded-xl p-4"
                style={{
                  backgroundColor: isLight ? '#F7F2E8' : '#0F172A',
                  borderColor: isLight ? '#E0D5C7' : '#334155',
                }}
              >
                <Avatar>
                  <AvatarFallback className="font-bold">
                    {name ? name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p 
                    className="text-sm font-semibold"
                    style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}
                  >
                    Create your account
                  </p>
                  <p style={{ color: isLight ? '#A38970' : '#CBD5E1' }} className="text-xs">
                    Join 5,000+ learners and grow confidently
                  </p>
                </div>
              </div>

              {/* NAME */}
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              {/* EMAIL */}
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* PASSWORD */}
              <div className="flex gap-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>

              {/* TERMS */}
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={agree}
                  onCheckedChange={(v) => setAgree(Boolean(v))}
                />
                <span className="text-sm" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>
                  I agree to the Terms of Service
                </span>
              </label>

              {/* SUBMIT */}
              <Button
                type="submit"
                disabled={loading || !agree}
                className="w-full py-6 text-base"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>

              {/* DIVIDER */}
              <div className="flex items-center gap-3">
                <div 
                  className="h-px flex-1"
                  style={{ backgroundColor: isLight ? '#E0D5C7' : '#334155' }}
                />
                <span className="text-xs" style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>
                  Or continue with
                </span>
                <div 
                  className="h-px flex-1"
                  style={{ backgroundColor: isLight ? '#E0D5C7' : '#334155' }}
                />
              </div>

              {/* OAUTH */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  Google
                </Button>
                <Button variant="outline" className="flex-1">
                  GitHub
                </Button>
              </div>

              {/* LOGIN LINK */}
              <p className="text-center text-sm" style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() =>
                    router.push(course ? `/login?course=${course}` : "/login")
                  }
                  className="font-medium underline"
                  style={{ color: isLight ? '#D1AF62' : '#4FD1FF' }}
                >
                  Login
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

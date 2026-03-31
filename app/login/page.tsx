"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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

export default function LoginPage() {
  const router = useRouter()
  const { isLight } = useTheme()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      const user = data.user

      // Ensure profile exists by delegating to the server API. This avoids
      // client-side RLS/permission issues when sessions are not persisted.
      try {
        await fetch('/api/create-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user?.email ?? email, full_name: null }),
        })
      } catch (e) {
        console.warn('create-profile API failed', e)
      }

      const params = new URLSearchParams(window.location.search)
      let redirect = params.get("redirect") || "/"
      if (redirect.startsWith('/courses')) redirect = '/courses'
      router.push(redirect)
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
          className="relative overflow-hidden shadow-2xl rounded-3xl"
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
              Welcome back
            </CardTitle>
            <CardDescription style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>
              Login to continue your learning journey
            </CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                Back
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {/* ACCOUNT PREVIEW */}
              <div 
                className="flex items-center gap-4 rounded-xl p-4"
                style={{
                  backgroundColor: isLight ? '#F7F2E8' : '#0F172A',
                  borderColor: isLight ? '#E0D5C7' : '#334155',
                }}
              >
                <Avatar>
                  <AvatarFallback className="font-bold">N</AvatarFallback>
                </Avatar>
                <div>
                  <p 
                    className="text-sm font-semibold"
                    style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}
                  >
                    Sign in to your account
                  </p>
                  <p style={{ color: isLight ? '#A38970' : '#CBD5E1' }} className="text-xs">
                    Access courses & saved progress
                  </p>
                </div>
              </div>

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

              {/* REMEMBER / FORGOT */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={(v) => setRemember(Boolean(v))}
                  />
                  <span className="text-sm" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>Remember me</span>
                </label>
                <Link href="/forgot" className="text-sm underline" style={{ color: isLight ? '#D1AF62' : '#4FD1FF' }}>
                  Forgot password?
                </Link>
              </div>

              {/* SUBMIT */}
              <Button type="submit" disabled={loading} className="w-full py-6 text-base">
                {loading ? "Signing in..." : "Login & Continue"}
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

              {/* SIGNUP */}
              <p className="text-center text-sm" style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>
                Don't have an account?{" "}
                <Link href="/signup" className="font-medium underline" style={{ color: isLight ? '#D1AF62' : '#4FD1FF' }}>
                  Create one
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

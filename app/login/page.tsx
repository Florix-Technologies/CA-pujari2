"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import supabase from "@/lib/supabaseClient"
import { useTheme } from "@/hooks/useTheme"
import { Eye, EyeOff, X } from "lucide-react"
import { motion } from "framer-motion"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function LoginPage() {
  const router = useRouter()
  const { isLight } = useTheme()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      try {
        await fetch("/api/create-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.user?.email ?? email, full_name: null }),
        })
      } catch {}
      const params = new URLSearchParams(window.location.search)
      let redirect = params.get("redirect") || "/"
      if (redirect.startsWith("/courses")) redirect = "/courses"
      router.push(redirect)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── tokens ──
  const bg = isLight
    ? "linear-gradient(135deg,#F8EED6 0%,#EFE1C0 50%,#EAD9B4 100%)"
    : "linear-gradient(135deg,#0C0A06 0%,#171208 50%,#1C1609 100%)"

  const glass = isLight
    ? {
        background: "rgba(255,250,238,0.72)",
        backdropFilter: "blur(28px) saturate(160%)",
        WebkitBackdropFilter: "blur(28px) saturate(160%)",
        border: "1px solid rgba(180,140,60,0.20)",
        boxShadow: "0 20px 60px rgba(140,100,20,0.14), inset 0 1px 0 rgba(255,255,255,0.8)",
      }
    : {
        background: "rgba(20,15,8,0.60)",
        backdropFilter: "blur(28px) saturate(160%)",
        WebkitBackdropFilter: "blur(28px) saturate(160%)",
        border: "1px solid rgba(255,225,140,0.10)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,230,140,0.06)",
      }

  const inputStyle = isLight
    ? { background: "rgba(255,252,242,0.80)", border: "1px solid rgba(180,140,60,0.25)", color: "#2E200A" }
    : { background: "rgba(10,7,2,0.55)",      border: "1px solid rgba(255,225,140,0.12)", color: "#F5E8CC" }

  const textPrimary   = isLight ? "#2E200A" : "#F5E8CC"
  const textSecondary = isLight ? "#6B4E1C" : "#BF9760"
  const accent        = isLight ? "#8B5E14" : "#D4A040"
  const btnBg         = isLight ? "#2E200A" : "#F0DFB8"
  const btnText       = isLight ? "#F0DFB8" : "#1C1206"

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: bg }}
    >
      {/* blobs */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: isLight ? "rgba(200,160,60,0.15)" : "rgba(130,90,10,0.18)" }} />
      <div className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none"
        style={{ background: isLight ? "rgba(180,130,40,0.12)" : "rgba(100,65,5,0.15)" }} />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease }}
        className="relative w-full max-w-sm sm:max-w-md"
      >
        <div className="rounded-3xl p-7 sm:p-10 relative" style={glass as React.CSSProperties}>

          {/* Close — back to home */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => router.push("/")}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all"
            style={{
              background: isLight ? "rgba(180,140,60,0.12)" : "rgba(100,140,255,0.10)",
              border: isLight ? "1px solid rgba(180,140,60,0.22)" : "1px solid rgba(100,140,255,0.18)",
              color: isLight ? "#8B5E14" : "#8AADFF",
            }}
            title="Back to home"
          >
            <X size={15} strokeWidth={2} />
          </motion.button>

          {/* Logo mark */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-1 w-9 h-9">
              {[0,1,2,3].map(i => (
                <div key={i} className="rounded-sm" style={{ background: accent }} />
              ))}
            </div>
          </div>

          {/* Heading */}
          <h1 className={`text-3xl sm:text-4xl font-extrabold mb-1 tracking-tight ${playfair.className}`}
            style={{ color: textPrimary }}>
            Welcome back
          </h1>
          <p className="text-sm mb-7" style={{ color: textSecondary }}>
            Glad to see you again 👋<br />Login to your account below
          </p>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
          )}

          {/* Google */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold mb-6 transition-all hover:opacity-80"
            style={{ ...(glass as React.CSSProperties), color: textPrimary }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: textSecondary }}>
                Email
              </label>
              <input
                type="email"
                placeholder="enter email..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all placeholder:opacity-40"
                style={inputStyle as React.CSSProperties}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: textSecondary }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="enter password..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm focus:outline-none transition-all placeholder:opacity-40"
                  style={inputStyle as React.CSSProperties}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                  style={{ color: textSecondary }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot" className="text-xs font-medium hover:underline" style={{ color: accent }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all"
              style={{ background: btnBg, color: btnText, opacity: loading ? 0.75 : 1 }}
            >
              {loading ? "Signing in…" : "Login"}
            </motion.button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: textSecondary }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold hover:underline" style={{ color: accent }}>
              Sign up for Free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import supabase from "@/lib/supabaseClient"
import { useTheme } from "@/hooks/useTheme"
import { Eye, EyeOff, ChevronDown, X } from "lucide-react"
import { motion } from "framer-motion"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function SignupClient() {
  const router        = useRouter()
  const { isLight }   = useTheme()
  const searchParams  = useSearchParams()
  const course        = searchParams?.get("course")
  const redirectParam = searchParams?.get("redirect")

  const [name, setName]             = useState("")
  const [email, setEmail]           = useState("")
  const [password, setPassword]     = useState("")
  const [confirm, setConfirm]       = useState("")
  const [ageRange, setAgeRange]     = useState("")
  const [occupation, setOccupation] = useState("")
  const [education, setEducation]   = useState("")
  const [city, setCity]             = useState("")
  const [agree, setAgree]           = useState(false)
  const [showPw, setShowPw]         = useState(false)
  const [error, setError]           = useState("")
  const [loading, setLoading]       = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError("Passwords do not match"); return }
    setError("")
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error && error.status === 429) {
        const res  = await fetch("/api/admin-create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, full_name: name }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "admin-create-user failed")
      } else if (error) {
        throw error
      }
      try {
        await fetch("/api/create-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, full_name: name, age_range: ageRange, occupation, education_level: education, city }),
        })
      } catch {}
      if (redirectParam) router.push(redirectParam)
      else if (course)   router.push("/courses")
      else               router.push("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── design tokens ──────────────────────────────────────────────
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

  const inputStyle: React.CSSProperties = isLight
    ? { background: "rgba(255,252,242,0.80)", border: "1px solid rgba(180,140,60,0.25)", color: "#2E200A" }
    : { background: "rgba(10,7,2,0.55)",      border: "1px solid rgba(255,225,140,0.12)", color: "#F5E8CC" }

  const textPrimary   = isLight ? "#2E200A" : "#F5E8CC"
  const textSecondary = isLight ? "#6B4E1C" : "#BF9760"
  const accent        = isLight ? "#8B5E14" : "#D4A040"
  const btnBg         = isLight ? "#2E200A" : "#F0DFB8"
  const btnText       = isLight ? "#F0DFB8" : "#1C1206"

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: textSecondary }}>
      {children}
    </label>
  )

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all placeholder:opacity-40"

  const SelectField = ({
    value, onChange, placeholder, options,
  }: { value: string; onChange: (v: string) => void; placeholder: string; options: string[] }) => (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        className={`${inputCls} appearance-none pr-9`}
        style={{
          ...inputStyle,
          color: value ? inputStyle.color : isLight ? "rgba(46,32,10,0.4)" : "rgba(245,232,204,0.4)",
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
        style={{ color: textSecondary }}
      />
    </div>
  )

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
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
        className="relative w-full max-w-xl"
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
          <div className="mb-5">
            <div className="grid grid-cols-2 gap-1 w-8 h-8">
              {[0,1,2,3].map(i => (
                <div key={i} className="rounded-sm" style={{ background: accent }} />
              ))}
            </div>
          </div>

          <h1 className={`text-3xl sm:text-4xl font-extrabold mb-1 tracking-tight ${playfair.className}`}
            style={{ color: textPrimary }}>
            Sign up
          </h1>
          <p className="text-sm mb-6" style={{ color: textSecondary }}>
            Enter your details below to create your account and get started.
          </p>

          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

          <form onSubmit={handleSignup} className="space-y-4">

            {/* Row 1 — Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <input type="text" placeholder="enter..." value={name}
                  onChange={e => setName(e.target.value)} required
                  className={inputCls} style={inputStyle} />
              </div>
              <div>
                <Label>Email</Label>
                <input type="email" placeholder="example@gmail.com" value={email}
                  onChange={e => setEmail(e.target.value)} required
                  className={inputCls} style={inputStyle} />
              </div>
            </div>

            {/* Row 2 — Age Range + Occupation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Age Range</Label>
                <SelectField
                  value={ageRange} onChange={setAgeRange} placeholder="Select"
                  options={["18–24", "25–35", "36–45", "46–55", "56+"]}
                />
              </div>
              <div>
                <Label>Occupation</Label>
                <SelectField
                  value={occupation} onChange={setOccupation} placeholder="Select"
                  options={["Student", "Working Professional", "Business Owner", "Freelancer", "Retired", "Other"]}
                />
              </div>
            </div>

            {/* Row 3 — Education + City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Education Level</Label>
                <SelectField
                  value={education} onChange={setEducation} placeholder="Select"
                  options={["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Other"]}
                />
              </div>
              <div>
                <Label>City / Country</Label>
                <input type="text" placeholder="e.g. Mumbai, India" value={city}
                  onChange={e => setCity(e.target.value)} required
                  className={inputCls} style={inputStyle} />
              </div>
            </div>

            {/* Row 4 — Password + Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} placeholder="enter..."
                    value={password} onChange={e => setPassword(e.target.value)} required
                    className={`${inputCls} pr-11`} style={inputStyle} />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                    style={{ color: textSecondary }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <Label>Confirm Password</Label>
                <input type={showPw ? "text" : "password"} placeholder="enter..."
                  value={confirm} onChange={e => setConfirm(e.target.value)} required
                  className={inputCls} style={inputStyle} />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
              <div
                onClick={() => setAgree(a => !a)}
                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: agree ? btnBg : "transparent",
                  border: `1.5px solid ${agree ? btnBg : "rgba(140,94,20,0.4)"}`,
                }}
              >
                {agree && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke={btnText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-xs" style={{ color: textSecondary }}>
                I agree to the{" "}
                <span className="font-semibold" style={{ color: accent }}>Terms of Service</span>
              </span>
            </label>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button type="button" onClick={() => router.back()}
                className="py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
                style={{ ...(glass as React.CSSProperties), color: textPrimary }}>
                Cancel
              </button>
              <motion.button
                whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={loading || !agree}
                className="py-3 rounded-xl font-bold text-sm transition-all"
                style={{
                  background: btnBg, color: btnText,
                  opacity: loading || !agree ? 0.65 : 1,
                  cursor: loading || !agree ? "not-allowed" : "pointer",
                }}>
                {loading ? "Creating…" : "Confirm"}
              </motion.button>
            </div>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: textSecondary }}>
            Already have an account?{" "}
            <button type="button"
              onClick={() => router.push(course ? `/login?course=${course}` : "/login")}
              className="font-semibold hover:underline" style={{ color: accent }}>
              Login
            </button>
          </p>

        </div>
      </motion.div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/hooks/useTheme"
import supabase from "@/lib/supabaseClient"
import { Menu, X, LogIn, LogOut, User as UserIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { isLight } = useTheme()

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Webinars", href: "/webinars" },
    { label: "NSE", href: "/nse" },
    { label: "Community", href: "/community" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  // Track scroll for style + hide-on-scroll-down behaviour
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let lastY = window.scrollY

    const handleScroll = () => {
      const currentY = window.scrollY
      const goingDown = currentY > lastY

      setScrolled(currentY > 20)
      setHidden(goingDown && currentY > 80)   // hide only after 80px to avoid flash on page load

      lastY = currentY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Theme-aware colors
  const navBgScroll = isLight ? "bg-[#F7F2E8]/80" : "bg-[#0F172A]/80"
  const navBgDefault = isLight ? "bg-[#F7F2E8]/40" : "bg-[#0F172A]/40"
  const navBorder = isLight ? "border-[#A38970]/30" : "border-[#4FD1FF]/30"
  const itemBg = isLight ? "bg-white/40" : "bg-slate-800/40"
  const itemBgHover = isLight ? "border-[#A38970]/30" : "border-[#4FD1FF]/30"
  const itemActive = isLight ? "bg-[#3E3730]" : "bg-[#4FD1FF]"
  const itemText = isLight ? "text-[#A38970]" : "text-[#A5B4FC]"
  const itemTextActive = isLight ? "text-white" : "text-white"
  const itemTextHover = isLight ? "hover:text-[#3E3730]" : "hover:text-[#4FD1FF]"
  const dividerColor = isLight ? "bg-[#A38970]/40" : "bg-[#4FD1FF]/40"
  const hoverGlow = isLight ? "bg-[#D1AF62]/20" : "bg-[#4FD1FF]/20"
  const logoShadow = isLight ? "drop-shadow-md" : "drop-shadow-lg"

  function AuthArea() {
    const { user, loading } = useAuth()

    const displayName =
      (user as any)?.user_metadata?.full_name || (user as any)?.user_metadata?.fullName || (user as any)?.email

    const handleSignOut = async () => {
      await supabase.auth.signOut()
      router.push('/')
    }

    if (loading) return null

    if (!user)
      return (
        <button
          onClick={() => router.push('/login')}
          className={`group relative flex items-center justify-center gap-2 px-6 py-2 text-[14px] font-bold rounded-full border transition-all duration-300 ease-out overflow-hidden hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98] ${
            isLight
              ? 'bg-gradient-to-b from-[#D1AF62] to-[#b69650] text-white hover:from-[#DAC07A] hover:to-[#c6a358] border-[#E9D59E]/30 shadow-[0_4px_12px_rgba(209,175,98,0.35)] hover:shadow-[0_8px_22px_rgba(209,175,98,0.5)] active:shadow-[0_2px_8px_rgba(209,175,98,0.35)]'
              : 'bg-gradient-to-b from-[#4FD1FF] to-[#3B82F6] text-white hover:from-[#60D9FF] hover:to-[#4F92FF] border-[#4FD1FF]/30 shadow-[0_4px_12px_rgba(79,209,255,0.35)] hover:shadow-[0_8px_22px_rgba(79,209,255,0.5)] active:shadow-[0_2px_8px_rgba(79,209,255,0.35)]'
          }`}
        >
          {/* Subtle shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[800ms] ease-in-out skew-x-12" />
          <LogIn size={16} className="relative z-10 drop-shadow-sm" />
          <span className="relative z-10 tracking-wide drop-shadow-sm">Login</span>
        </button>
      )

    return (
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border shadow-sm">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <UserIcon size={14} />
          </div>
          <span className="text-xs font-medium max-w-[100px] truncate">{displayName}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    )
  }

  return (
    // Fixed wrapper positions the floating nav at the top
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pb-2 pointer-events-none">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: hidden ? "-120%" : 0, opacity: hidden ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className={`pointer-events-auto w-full max-w-6xl rounded-full transition-all duration-500 ${scrolled
          ? `${navBgScroll} backdrop-blur-xl ${navBorder} shadow-xl py-2`
          : `${navBgDefault} backdrop-blur-md border border-transparent shadow-none py-4`
          }`}
      >
        <div className="px-5 md:px-8">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-3 relative group"
              aria-label="Home"
            >
              <div className={`absolute inset-0 ${hoverGlow} blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
              <img src="/faviconSP.png" alt="Shobha Pujari" className={`h-9 w-auto relative z-10 ${logoShadow} transition-transform group-hover:scale-105`} />
            </button>

            {/* Desktop Nav */}
            <div className={`hidden md:flex items-center gap-1 ${itemBg} p-1.5 rounded-full ${itemBgHover} shadow-inner`}>
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/")
                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`relative px-5 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${isActive ? itemTextActive : `${itemText} ${itemTextHover}`
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className={`absolute inset-0 ${itemActive} rounded-full shadow-md ${itemBgHover}`}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Right Group */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <div className={`w-px h-6 ${dividerColor} mx-1`}></div>
              <AuthArea />
            </div>

            {/* Mobile controls */}
            <div className="flex md:hidden items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full bg-white/40 hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/20 text-[#3E3730] dark:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden w-full absolute top-full left-0 mt-3 bg-[#F7F2E8] dark:bg-[#0f0f0f] backdrop-blur-xl border border-[#A38970]/30 dark:border-white/10 shadow-2xl rounded-3xl z-50"
              style={{ maxHeight: '80vh', overflowY: 'auto' }}
            >
              <div className="px-6 py-6 flex flex-col gap-2 relative z-10">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/")
                  return (
                    <button
                      key={item.href}
                      onClick={() => {
                        router.push(item.href)
                        setIsOpen(false)
                      }}
                      className={`flex items-center justify-start px-6 py-4 rounded-2xl text-base font-bold transition-all relative z-10 ${
                        isActive
                          ? "bg-[#D1AF62] dark:bg-blue-600 text-white shadow-lg"
                          : "text-[#3E3730] dark:text-gray-200 hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-md bg-white/40 dark:bg-white/5"
                        }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
                <div className="h-px w-full bg-[#A38970]/40 dark:bg-white/10 my-4" />
                <div className="flex justify-center pb-2">
                  <AuthArea />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  )
}

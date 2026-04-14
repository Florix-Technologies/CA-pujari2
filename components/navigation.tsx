"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/hooks/useTheme"
import supabase from "@/lib/supabaseClient"
import { Menu, X, LogIn, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react"
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
  const { user, loading, role } = useAuth()

  const displayName =
    (user as any)?.user_metadata?.full_name || (user as any)?.user_metadata?.fullName || (user as any)?.email

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Webinars", href: "/webinars" },
    { label: "NSE", href: "/nse" },
    { label: "Community", href: "/community" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  // Add Admin link if user is admin
  if (role === 'admin') {
    navItems.unshift({ label: "Admin", href: "/admin" })
  }

  // Add My Dashboard link for logged-in students (non-admin)
  if (user && role && role !== 'admin') {
    navItems.unshift({ label: "Dashboard", href: "/dashboard" })
  }

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
  const navBgScroll = isLight ? "bg-white/40" : "bg-[#0F172A]/50"
  const navBgDefault = isLight ? "bg-white/20" : "bg-[#0F172A]/25"
  const navBorder = isLight ? "border-white/60" : "border-white/10"
  const itemBg = isLight ? "bg-white/50" : "bg-white/5"
  const itemBgHover = isLight ? "border-[#A38970]/30" : "border-[#4FD1FF]/30"
  const itemActive = isLight ? "bg-[#3E3730]" : "bg-[#4FD1FF]"
  const itemText = isLight ? "text-[#A38970]" : "text-[#A5B4FC]"
  const itemTextActive = isLight ? "text-white" : "text-white"
  const itemTextHover = isLight ? "hover:text-[#3E3730]" : "hover:text-[#4FD1FF]"
  const dividerColor = isLight ? "bg-[#A38970]/40" : "bg-[#4FD1FF]/40"
  const hoverGlow = isLight ? "bg-[#D1AF62]/20" : "bg-[#4FD1FF]/20"
  const logoShadow = isLight ? "drop-shadow-md" : "drop-shadow-lg"

  function AuthArea() {
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
        <div 
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-colors"
          style={{ 
            backgroundColor: isLight ? '#fcfaf5' : '#1E293B',
            borderColor: isLight ? '#E0D5C7' : 'rgba(255, 255, 255, 0.1)',
            color: isLight ? '#3E3730' : '#E2E8F0'
          }}
        >
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: isLight ? '#D1AF62/20' : 'rgba(96, 165, 250, 0.2)', color: isLight ? '#D1AF62' : '#60A5FA' }}
          >
            <UserIcon size={14} />
          </div>
          <span className="text-xs font-semibold max-w-[120px] truncate">{displayName}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="p-2 rounded-full transition-all duration-300 hover:scale-110"
          style={{ color: isLight ? '#A38970' : '#CBD5E1' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = isLight ? '#A38970' : '#CBD5E1'}
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
        style={{
          background: scrolled
            ? isLight
              ? 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(247,242,232,0.45) 100%)'
              : 'linear-gradient(135deg, rgba(15,23,42,0.55) 0%, rgba(30,41,59,0.45) 100%)'
            : isLight
              ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(247,242,232,0.18) 100%)'
              : 'linear-gradient(135deg, rgba(15,23,42,0.28) 0%, rgba(30,41,59,0.18) 100%)',
          boxShadow: scrolled
            ? isLight
              ? '0 8px 32px rgba(163,137,112,0.18), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(163,137,112,0.1)'
              : '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(79,209,255,0.06)'
            : 'none',
          border: scrolled
            ? `1px solid ${isLight ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.08)'}`
            : '1px solid transparent',
        }}
        className={`pointer-events-auto w-full max-w-6xl rounded-full transition-all duration-300 ${scrolled
          ? `backdrop-blur-2xl saturate-150 py-2`
          : `backdrop-blur-md py-4`
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
              className="md:hidden overflow-hidden w-full absolute top-full left-0 mt-3 backdrop-blur-2xl saturate-150 border shadow-2xl rounded-3xl z-50"
            style={{
              background: isLight
                ? 'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(247,242,232,0.60) 100%)'
                : 'linear-gradient(135deg, rgba(15,23,42,0.75) 0%, rgba(30,41,59,0.65) 100%)',
              borderColor: isLight ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.08)',
              boxShadow: isLight
                ? '0 20px 60px rgba(163,137,112,0.2), inset 0 1px 0 rgba(255,255,255,0.9)'
                : '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
            }}
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

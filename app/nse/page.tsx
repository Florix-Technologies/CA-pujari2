"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"

import { Playfair_Display } from "next/font/google"
import { PremiumCard } from "@/components/ui/premium-card"
import { BookingModal } from "@/components/ui/service-modals"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronDown, ChevronUp, Sparkles, TrendingUp, Shield, Crown } from "lucide-react"
import { premiumStagger, premiumFadeUp, premiumEasing } from "@/lib/animations"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function NSEPage() {
  const { isLight } = useTheme()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeCard, setActiveCard] = useState<string | null>(null)
  
  // Dynamic Content States
  const [nsePlans, setNsePlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean
    title: string
    price: string
    section: string
  }>({
    isOpen: false,
    title: "",
    price: "",
    section: ""
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/nse')
        const data = await res.json()
        setNsePlans(Array.isArray(data) ? data : (data.data || []))
      } catch (err) {
        console.error("Failed to fetch NSE plans", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleProtectedAction = (redirectPath: string) => {
    if (!user && !authLoading) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.hash)}`)
      return
    }
    router.push(redirectPath)
  }

  const handleEnrollClick = (plan: any) => {
    if (!user && !authLoading) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.hash)}`)
      return
    }
    setActiveModal({
      isOpen: true,
      title: plan.title,
      price: plan.price,
      section: plan.section || plan.category || 'foundational'
    })
  }

  const closeModal = () => {
    setActiveModal({ ...activeModal, isOpen: false })
  }

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress((window.scrollY / totalHeight) * 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const bg = isLight ? "#F7F2E8" : "#0F172A"
  const cardBg = isLight ? "#FFFFFF" : "#1A2847"
  const text = isLight ? "#3E3730" : "#E0E7FF"
  const accent = isLight ? "#D1AF62" : "#4FD1FF"
  const subtle = isLight ? "#EBE5D8" : "#243456"

  return (
    <main
      style={{ backgroundColor: bg, color: text } as React.CSSProperties}
      className="min-h-screen"
    >
      {/* SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-1" style={{ backgroundColor: subtle }}>
        <motion.div
          className="h-full"
          style={{ width: `${scrollProgress}%`, backgroundColor: accent }}
          transition={{ ease: "linear" }}
        />
      </div>

      <Navigation />

      {/* HERO — PREMIUM FINTECH REDESIGN */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[var(--fin-border-divider)] perspective-1000">
        <video
          src={isLight ? '/nseday.mp4' : '/nsenight.mp4'}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* dark translucent overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        <motion.div
          variants={premiumStagger}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-4xl mx-auto px-6 z-10"
          style={{ marginTop: '100px' }}
        >
          {/* Premium Octagon Card Container with Overlapping Images */}
          <div className="relative md:min-h-[180px]">
            {/* Main Card with Octagon Shape - Clean, Single Layer */}
            <motion.div
              variants={premiumFadeUp}
              className="relative w-full md:min-h-[180px] overflow-visible z-20"
              style={{ 
                background: 'transparent',
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                borderRadius: '60px',
                border: isLight ? '3px double #D4A574' : '3px double #4FD1FF',
                boxShadow: isLight ? '0 20px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)' : '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                position: 'relative',
                backdropFilter: 'blur(2px)'
              }}
            >
              {/* Grid Layout: Center Text Only */}
              <div className="flex items-center justify-center relative z-20">
                
                {/* CENTER: Text Content */}
                <motion.div 
                  variants={premiumStagger}
                  className="px-12 md:px-16 py-6 md:py-8 text-center flex flex-col justify-start relative z-40"
                >
                  <motion.p
                    variants={premiumFadeUp}
                    className="uppercase tracking-[0.15em] mb-2 font-semibold text-sm md:text-base"
                    style={{
                      color: isLight ? '#D1AF62' : '#4FD1FF',
                      textShadow: isLight ? '0 2px 8px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    Growth • Mastery • Excellence
                  </motion.p>

                  <motion.h1
                    variants={premiumFadeUp}
                    className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 ${playfair.className} tracking-tight leading-tight`}
                    style={{
                      color: isLight ? '#D1AF62' : '#4FD1FF',
                      textShadow: isLight ? '0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.7), 0 2px 4px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    NSE Investment Programs
                  </motion.h1>

                  <motion.p
                    variants={premiumFadeUp}
                    className="text-sm md:text-base lg:text-lg leading-relaxed font-medium mb-4"
                    style={{
                      color: isLight ? '#D1AF62' : '#4FD1FF',
                      textShadow: isLight ? '0 2px 8px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    Choose the right level of trading education and mentorship designed for your growth.
                  </motion.p>

                  {/* Button Half-Box Container */}
                  <motion.div 
                    variants={premiumFadeUp}
                    className="mt-6 -mx-12 md:-mx-16 pt-6 border-t-2 border-b-2"
                    style={{
                      borderColor: isLight ? '#D4A574' : '#4FD1FF',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <div className="px-12 md:px-16 pb-6">
                      <motion.p
                        variants={premiumFadeUp}
                        className="text-base md:text-lg font-semibold mb-4 text-center"
                        style={{
                          color: isLight ? '#D1AF62' : '#4FD1FF'
                        }}
                      >
                        Explore our
                      </motion.p>

                      {/* PREMIUM GRADIENT BUTTONS */}
                      <motion.div 
                        variants={premiumFadeUp}
                        className="flex flex-col sm:flex-row gap-3 items-center justify-center"
                      >
                        <motion.a
                          href="#plans"
                          whileHover={{ scale: 1.03, filter: 'brightness(1.08)' }}
                          whileTap={{ scale: 0.98 }}
                          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-base md:text-lg transition-all duration-300 cursor-pointer"
                          style={{
                            background: isLight ? 'linear-gradient(135deg, #d4af37, #c69c2d)' : 'linear-gradient(135deg, #4FD1FF, #3B82F6)',
                            border: isLight ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(79, 209, 255, 0.3)',
                            color: '#ffffff',
                            boxShadow: isLight ? '0 4px 12px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(79, 209, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" /><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" clipRule="evenodd" /></svg>
                          Foundational & Growth Programs
                        </motion.a>
                        <motion.a
                          href="#contact"
                          whileHover={{ scale: 1.03, filter: 'brightness(1.08)' }}
                          whileTap={{ scale: 0.98 }}
                          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-base md:text-lg transition-all duration-300 cursor-pointer"
                          style={{
                            background: isLight ? 'linear-gradient(135deg, #d4af37, #c69c2d)' : 'linear-gradient(135deg, #4FD1FF, #3B82F6)',
                            border: isLight ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(79, 209, 255, 0.3)',
                            color: '#ffffff',
                            boxShadow: isLight ? '0 4px 12px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(79, 209, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                          Advanced & Elite Programs
                        </motion.a>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* PLANS GRID */}
      <section id="plans" className="py-24 relative border-b border-[var(--fin-border-divider)]" style={{ background: isLight ? 'radial-gradient(circle at 50% 40%, rgba(0,0,0,0.03), transparent 60%), linear-gradient(180deg, #f8f5f0 0%, #efe6da 100%)' : '#0F172A' }}>
        {/* SECTION 1: Foundational & Growth Programs */}
        <motion.div
          variants={premiumStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-6 mb-24"
        >
          <div className="text-center mb-12">
            <motion.h2
              variants={premiumFadeUp}
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[var(--fin-text-primary)] ${playfair.className}`}
            >
              Foundational & Growth Programs
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[400px] w-full rounded-2xl" />
                </div>
              ))
            ) : (
              nsePlans.slice(0, 3).map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.04, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative"
                >
                  {/* Liquid Glass Wrapper */}
                  <div
                    className="relative rounded-2xl border border-[#D4AF37]/40 overflow-hidden transition-all duration-500 group-hover:border-[#D4AF37]/80 group-hover:shadow-[0_20px_60px_rgba(212,175,55,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]"
                    style={{
                      background: isLight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(12px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                      boxShadow: isLight ? '0 8px 32px 0 rgba(31, 38, 135, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {/* Subtle inner glow on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: isLight ? 'radial-gradient(ellipse at top-left, rgba(212,175,55,0.1), transparent 60%)' : 'radial-gradient(ellipse at top-left, rgba(79,209,255,0.05), transparent 60%)'
                      }}
                    />
  
                    {/* Light reflection streak */}
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                      style={{
                        background: isLight ? 'linear-gradient(90deg, transparent, #D4AF37, transparent)' : 'linear-gradient(90deg, transparent, #4FD1FF, transparent)'
                      }}
                    />
  
                    <PremiumCard
                      key={plan.id}
                      id={plan.id}
                      title={plan.title}
                      description={plan.description}
                      badgeLabel={plan.badgeLabel}
                      price={plan.price}
                      priceLabel="Investment"
                      actionLabel="Enroll Now"
                      onClick={() => handleEnrollClick(plan)}
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* SECTION 2: Advanced & Elite Programs */}
        <motion.div
          variants={premiumStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-12">
            <motion.h2
              variants={premiumFadeUp}
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[var(--fin-text-primary)] ${playfair.className}`}
            >
              Advanced & Elite Programs
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[400px] w-full rounded-2xl" />
                </div>
              ))
            ) : (
              nsePlans.slice(3, 6).map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.04, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative"
                >
                  {/* Liquid Glass Wrapper */}
                  <div
                    className="relative rounded-2xl border border-[#D4AF37]/40 overflow-hidden transition-all duration-500 group-hover:border-[#D4AF37]/80 group-hover:shadow-[0_20px_60px_rgba(212,175,55,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]"
                    style={{
                      background: isLight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(12px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                      boxShadow: isLight ? '0 8px 32px 0 rgba(31, 38, 135, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {/* Subtle inner glow on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: isLight ? 'radial-gradient(ellipse at top-left, rgba(212,175,55,0.1), transparent 60%)' : 'radial-gradient(ellipse at top-left, rgba(79,209,255,0.05), transparent 60%)'
                      }}
                    />
  
                    {/* Light reflection streak */}
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                      style={{
                        background: isLight ? 'linear-gradient(90deg, transparent, #D4AF37, transparent)' : 'linear-gradient(90deg, transparent, #4FD1FF, transparent)'
                      }}
                    />
  
                    <PremiumCard
                      key={plan.id}
                      id={plan.id}
                      title={plan.title}
                      description={plan.description}
                      badgeLabel={plan.badgeLabel}
                      price={plan.price}
                      priceLabel="Investment"
                      actionLabel="Enroll Now"
                      onClick={() => handleEnrollClick(plan)}
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-32 relative overflow-hidden border-t border-[var(--fin-border-light)]" style={{ backgroundColor: isLight ? '#FFFFFF' : '#0F172A' }}>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--fin-accent-gold)]/40 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto rounded-3xl p-10"
          style={{ backgroundColor: cardBg, border: `1px solid ${subtle}` }}
        >
          <div className="text-3xl mb-3">🎯</div>
          <h2 className={`text-3xl font-bold mb-3 ${playfair.className}`}>
            Not sure which plan fits you?
          </h2>
          <p className="opacity-60 mb-8">
            Talk to us and we'll guide you to the right program based on your goals and experience.
          </p>
          <motion.button
            onClick={() => handleProtectedAction("/contact")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm cursor-pointer border-none"
            style={{ backgroundColor: accent, color: isLight ? "#fff" : "#0F172A" }}
          >
            <Shield size={16} />
            Contact Us for Guidance
          </motion.button>
        </motion.div>
      </section>

      <Footer />

      <BookingModal 
        isOpen={activeModal.isOpen}
        onClose={closeModal}
        serviceName={activeModal.title}
        price={activeModal.price}
        section={activeModal.section}
        apiEndpoint="/api/nse/book"
      />
    </main>
  )
}
"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTheme } from "@/hooks/useTheme"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"

import { Playfair_Display } from "next/font/google"
import { PremiumCard } from "@/components/ui/premium-card"
import { ChevronDown, ChevronUp, Sparkles, TrendingUp, Shield, Crown } from "lucide-react"

const playfair = Playfair_Display({ subsets: ["latin"] })

const nsePlans = [
  {
    id: "basic",
    title: "Basic",
    price: "₹5,000",
    badgeLabel: "Starter / Entry-Level Access",
    section: "foundational",
    icon: "📈",
    description: "Ideal for beginners who want to understand the fundamentals of stock market trading and build a strong foundation.",
    details: "Learn basics of stock market, risk management, and how to start trading with confidence.",
    features: [
      "Stock market fundamentals",
      "Demat & trading account setup",
      "Basic chart reading",
      "Risk awareness module",
      "Beginner trading checklist"
    ],
    forWhom: "Perfect for absolute beginners with zero trading experience.",
    duration: "4 Weeks",
    sessions: "8 Sessions"
  },
  {
    id: "standard",
    title: "Standard",
    price: "₹10,000",
    badgeLabel: "Core / Essential Tools & Guidance",
    section: "foundational",
    icon: "📊",
    description: "Covers essential trading strategies, tools, and practical insights to help you start trading with confidence.",
    details: "Includes technical analysis, tools, and structured approach for consistent trading.",
    features: [
      "Technical analysis basics",
      "Candlestick patterns",
      "Support & resistance levels",
      "Volume analysis",
      "Live market observation"
    ],
    forWhom: "For those who know basics and want structured strategy.",
    duration: "6 Weeks",
    sessions: "12 Sessions"
  },
  {
    id: "pro",
    title: "Pro",
    price: "₹50,000",
    badgeLabel: "Advanced / In-depth Strategies",
    section: "foundational",
    icon: "🔥",
    description: "Designed for serious learners who want advanced strategies, deeper market understanding, and real-world applications.",
    details: "Advanced price action, psychology, and real-world execution strategies.",
    features: [
      "Advanced price action",
      "Options & derivatives intro",
      "Trading psychology",
      "Live trade analysis",
      "Personal feedback sessions"
    ],
    forWhom: "For intermediate traders ready to go professional.",
    duration: "8 Weeks",
    sessions: "20 Sessions"
  },
  {
    id: "premium",
    title: "Premium",
    price: "₹1,10,000",
    badgeLabel: "✨ Most Popular • Elite Mentorship",
    section: "advanced",
    icon: "⭐",
    description: "Includes personalized mentorship, live sessions, and direct guidance to accelerate your trading journey.",
    details: "Direct mentorship, live trading, and priority support.",
    features: [
      "1-on-1 mentorship sessions",
      "Live trading with Shobha Pujari",
      "Custom trading plan",
      "Priority WhatsApp support",
      "Monthly portfolio review"
    ],
    forWhom: "For serious traders who want personalized expert guidance.",
    duration: "3 Months",
    sessions: "Unlimited"
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: "₹5,00,000",
    badgeLabel: "Professional / High-Volume Traders",
    section: "advanced",
    icon: "🏛️",
    description: "Built for professional traders looking for high-level strategies, capital management, and scaling techniques.",
    details: "Portfolio scaling, capital allocation, and advanced risk systems.",
    features: [
      "Institutional-level strategies",
      "Capital management system",
      "Advanced risk frameworks",
      "Algo trading introduction",
      "Dedicated support manager"
    ],
    forWhom: "For HNIs and professional traders managing large capital.",
    duration: "6 Months",
    sessions: "Unlimited + Priority"
  },
  {
    id: "ultimate",
    title: "Ultimate",
    price: "₹10,00,000",
    badgeLabel: "👑 Lifetime / VIP Access",
    section: "advanced",
    icon: "💎",
    description: "Complete lifetime access with exclusive mentorship, priority support, and elite-level trading insights.",
    details: "All features unlocked + lifetime mentorship + VIP access.",
    features: [
      "Lifetime platform access",
      "All future programs included",
      "VIP community access",
      "Direct CA-level consultation",
      "Business & tax advisory"
    ],
    forWhom: "For those who want everything — forever.",
    duration: "Lifetime",
    sessions: "Unlimited Lifetime"
  }
]

const tabs = [
  { id: "foundational", label: "Foundational & Growth", icon: <TrendingUp size={16} /> },
  { id: "advanced", label: "Advanced & Elite", icon: <Crown size={16} /> }
]

const floatingStats = [
  { label: "Students Trained", value: "2,000+" },
  { label: "Success Rate", value: "94%" },
  { label: "Years Experience", value: "10+" },
  { label: "Live Sessions", value: "500+" }
]

export default function NSEPage() {
  const { isLight } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress((window.scrollY / totalHeight) * 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleToggle = (id: string) => {
    setActiveCard(prev => (prev === id ? null : id))
  }

  const filteredPlans = nsePlans.filter(p => p.section === activeTab)

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
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onHoverStart={(e) => {
                            (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)';
                          }}
                          onHoverEnd={(e) => {
                            (e.currentTarget as HTMLElement).style.filter = 'brightness(1)';
                          }}
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
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onHoverStart={(e) => {
                            (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)';
                          }}
                          onHoverEnd={(e) => {
                            (e.currentTarget as HTMLElement).style.filter = 'brightness(1)';
                          }}
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
      <section id="plans" className="py-24 relative" style={{ backgroundColor: isLight ? '#FFFFFF' : '#0F172A' }}>
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
        </div>

        {/* CARDS GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: activeCard && activeCard !== plan.id ? 0.5 : 1,
                  y: 0,
                  scale: activeCard === plan.id ? 1.02 : 1
                }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="cursor-pointer"
                onClick={() => handleToggle(plan.id)}
              >
                <PremiumCard
                  id={plan.id}
                  title={`${plan.icon}  ${plan.title}`}
                  description={plan.description}
                  badgeLabel={plan.badgeLabel}
                  price={plan.price}
                  priceLabel="Investment"
                  actionUrl="/contact"
                  actionLabel="Enroll Now"
                />

                {/* EXPANDABLE PANEL */}
                <AnimatePresence>
                  {activeCard === plan.id && (
                    <motion.div
                      key="expand"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mt-3 rounded-2xl p-5 text-sm space-y-4"
                        style={{ backgroundColor: cardBg, border: `1px solid ${subtle}` }}
                      >
                        {/* Who it's for */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accent }}>
                            Who It's For
                          </p>
                          <p className="opacity-75">{plan.forWhom}</p>
                        </div>

                        {/* Features */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>
                            What's Included
                          </p>
                          <ul className="space-y-1.5">
                            {plan.features.map(f => (
                              <li key={f} className="flex items-center gap-2 opacity-80">
                                <span style={{ color: accent }}>✓</span> {f}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Duration + Sessions */}
                        <div className="flex gap-4">
                          <div
                            className="flex-1 rounded-xl px-3 py-2 text-center"
                            style={{ backgroundColor: subtle }}
                          >
                            <p className="text-xs opacity-60">Duration</p>
                            <p className="font-bold text-sm">{plan.duration}</p>
                          </div>
                          <div
                            className="flex-1 rounded-xl px-3 py-2 text-center"
                            style={{ backgroundColor: subtle }}
                          >
                            <p className="text-xs opacity-60">Sessions</p>
                            <p className="font-bold text-sm">{plan.sessions}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Toggle label */}
                <div
                  className="flex items-center justify-center gap-1 mt-3 text-xs font-semibold"
                  style={{ color: accent }}
                >
                  {activeCard === plan.id
                    ? <><ChevronUp size={14} /> Show Less</>
                    : <><ChevronDown size={14} /> View Details</>
                  }
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
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
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm"
            style={{ backgroundColor: accent, color: isLight ? "#fff" : "#0F172A" }}
          >
            <Shield size={16} />
            Contact Us for Guidance
          </motion.a>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
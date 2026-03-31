"use client"

import { useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTheme } from "@/hooks/useTheme"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"

import { Playfair_Display } from "next/font/google"
const playfair = Playfair_Display({ subsets: ["latin"] })
import { premiumFadeUp, premiumStagger } from "@/lib/animations"
import { PremiumCard } from "@/components/ui/premium-card"

const nsePlans = [
  {
    id: "basic",
    title: "Basic",
    price: "₹5,000",
    badgeLabel: "Starter / Entry-Level Access",
    description: "Ideal for beginners who want to understand the fundamentals of stock market trading and build a strong foundation.",
  },
  {
    id: "standard",
    title: "Standard",
    price: "₹10,000",
    badgeLabel: "Core / Essential Tools & Guidance",
    description: "Covers essential trading strategies, tools, and practical insights to help you start trading with confidence.",
  },
  {
    id: "pro",
    title: "Pro",
    price: "₹50,000",
    badgeLabel: "Advanced / In-depth Strategies",
    description: "Designed for serious learners who want advanced strategies, deeper market understanding, and real-world applications.",
  },
  {
    id: "premium",
    title: "Premium",
    price: "₹110,000",
    badgeLabel: "✨ Most Popular • Elite",
    description: "Includes personalized mentorship, live sessions, and direct guidance to accelerate your trading journey.",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: "₹500,000",
    badgeLabel: "Professional / High-Volume Traders",
    description: "Built for professional traders looking for high-level strategies, capital management, and scaling techniques.",
  },
  {
    id: "ultimate",
    title: "Ultimate",
    price: "₹1,000,000",
    badgeLabel: "Lifetime / VIP Access",
    description: "Complete lifetime access with exclusive mentorship, priority support, and elite-level trading insights.",
  }
]

export default function NSEPage() {
  const { isLight } = useTheme()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <main
      style={{
        '--fin-bg-primary': isLight ? '#F7F2E8' : '#0F172A',
        '--fin-bg-secondary': isLight ? '#EBE5D8' : '#1A2847',
        '--fin-bg-accent': isLight ? '#DFD8CC' : '#243456',
        '--fin-gradient-hero': isLight ? 'linear-gradient(90deg, #FBF8F2 0%, #F7F2E8 50%, #F5F0E6 100%)' : 'linear-gradient(90deg, #0F172A 0%, #1A2847 50%, #243456 100%)',
        '--fin-text-primary': isLight ? '#3E3730' : '#E0E7FF',
        '--fin-text-secondary': isLight ? '#645E56' : '#C7D2FE',
        '--fin-text-light': isLight ? '#8A847C' : '#A5B4FC',
        '--fin-accent-gold': isLight ? '#D1AF62' : '#4FD1FF',
        '--fin-accent-soft-gold': isLight ? '#A38970' : '#3B82F6',
        '--fin-border-light': isLight ? '#A38970' : '#4FD1FF',
        '--fin-border-divider': isLight ? '#D6CCBE' : '#334155'
      } as React.CSSProperties}
      className={`${isLight ? 'bg-white text-[var(--fin-text-primary)]' : 'bg-[#0F172A] text-[#E0E7FF]'} min-h-screen transition-colors duration-500 font-sans`}
    >
      <Navigation />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden border-b border-[var(--fin-border-divider)] perspective-1000 pt-20"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, background: 'var(--fin-gradient-hero)' }}
          className="absolute inset-0 z-0 will-change-transform"
        />

        <motion.div
          variants={premiumStagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          <motion.p
            variants={premiumFadeUp}
            className="uppercase tracking-[0.2em] text-[var(--fin-text-secondary)] mb-6 font-semibold text-sm"
          >
            Growth • Mastery • Excellence
          </motion.p>
          <motion.h1
            variants={premiumFadeUp}
            className={`text-5xl md:text-7xl font-extrabold text-[var(--fin-text-primary)] mb-8 ${playfair.className} tracking-tight leading-tight`}
          >
            NSE Investment Section for Stock Traders
          </motion.h1>
          <motion.p
            variants={premiumFadeUp}
            className="text-xl text-[var(--fin-text-secondary)] max-w-2xl mx-auto leading-relaxed"
          >
            Choose the right level of trading education and mentorship designed for your growth.
          </motion.p>
        </motion.div>
      </section>

      {/* PLANS GRID */}
      <section className="py-24 relative" style={{ backgroundColor: isLight ? '#FFFFFF' : '#0F172A' }}>
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
            {nsePlans.slice(0, 3).map((plan) => (
              <PremiumCard
                key={plan.id}
                id={plan.id}
                title={plan.title}
                description={plan.description}
                badgeLabel={plan.badgeLabel}
                price={plan.price}
                priceLabel="Investment"
                actionUrl={`/contact`}
                actionLabel="Enroll Now"
              />
            ))}
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
            {nsePlans.slice(3, 6).map((plan) => (
              <PremiumCard
                key={plan.id}
                id={plan.id}
                title={plan.title}
                description={plan.description}
                badgeLabel={plan.badgeLabel}
                price={plan.price}
                priceLabel="Investment"
                actionUrl={`/contact`}
                actionLabel="Enroll Now"
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden border-t border-[var(--fin-border-light)]" style={{ backgroundColor: isLight ? '#FFFFFF' : '#0F172A' }}>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--fin-accent-gold)]/40 to-transparent" />

        <motion.div
          variants={premiumStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
        >
          <motion.h2
            variants={premiumFadeUp}
            className={`text-4xl md:text-5xl font-extrabold mb-6 text-[var(--fin-text-primary)] ${playfair.className}`}
          >
            Not sure which plan to choose?
          </motion.h2>
          <motion.p
            variants={premiumFadeUp}
            className="text-xl text-[var(--fin-text-primary)]/80 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Reach out to our team to find the perfect fit for your trading goals and experience level.
          </motion.p>

          <motion.div variants={premiumFadeUp}>
            <Link
              href="/contact"
              style={{
                backgroundColor: isLight ? '#3E3730' : '#4FD1FF',
                color: isLight ? 'white' : '#0F172A'
              }}
              className="group/cta inline-flex items-center justify-center px-10 py-5 rounded-xl font-bold text-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_20px_40px_-10px_rgba(79,209,255,0.3)] hover:-translate-y-1.5 border border-transparent relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000 ease-in-out" />
              <span className="relative z-10">Contact us for guidance</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}

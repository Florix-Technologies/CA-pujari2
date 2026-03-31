"use client"

import { useEffect, useState, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTheme } from "@/hooks/useTheme"
import Link from "next/link"
import { Clock, Users, Book } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

import { Playfair_Display } from "next/font/google"
const playfair = Playfair_Display({ subsets: ["latin"] })
import { premiumFadeUp, premiumStagger } from "@/lib/animations"
import { PremiumCard } from "@/components/ui/premium-card"

type Course = {
  id: string
  title: string
  description?: string
  duration?: string
  level?: string
  modules?: number
  price?: string
  students_count?: number
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const { isLight } = useTheme()
  
  // For Parallax Effect
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/courses')
        const json = await res.json()
        if (res.ok) {
          if (mounted) setCourses((json.data as Course[]) ?? [])
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch /api/courses', json)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching /api/courses', err)
      }
      if (mounted) setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // fallback to original hardcoded demo data when DB returns empty
  const defaultCourses: Course[] = [
    {
      id: '1',
      title: 'Trading Fundamentals',
      description: 'Learn the foundations of stock market trading with clarity and confidence.',
      duration: '4 weeks',
      students_count: 2500,
      price: '₹4,999',
      level: 'Beginner',
      modules: 12,
    },
    {
      id: '2',
      title: 'Technical Analysis Mastery',
      description: 'Read charts like a professional using proven technical frameworks.',
      duration: '6 weeks',
      students_count: 1800,
      price: '₹7,999',
      level: 'Beginner',
      modules: 18,
    },
    {
      id: '3',
      title: 'Risk Management & Position Sizing',
      description: 'Protect your capital and trade with discipline, not emotion.',
      duration: '3 weeks',
      students_count: 1200,
      price: '₹3,999',
      level: 'Beginner',
      modules: 8,
    },
    {
      id: '4',
      title: 'Market Psychology',
      description: 'Understand fear, greed, and mindset — the real edge in trading.',
      duration: '4 weeks',
      students_count: 950,
      price: '₹5,999',
      level: 'Beginner',
      modules: 10,
    },
    {
      id: '5',
      title: 'Day Trading Strategies',
      description: 'Intraday frameworks designed for real-time market conditions.',
      duration: '5 weeks',
      students_count: 1400,
      price: '₹6,999',
      level: 'Beginner',
      modules: 15,
    },
    {
      id: '6',
      title: 'Option Trading Basics',
      description: 'Understand options without confusion — calls, puts, and basics.',
      duration: '6 weeks',
      students_count: 850,
      price: '₹8,999',
      level: 'Beginner',
      modules: 16,
    },
  ]

  const effectiveCourses = courses.length ? courses : defaultCourses

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

      {/* HERO — PREMIUM FINANCE */}
      <section 
        ref={heroRef}
        className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden border-b border-[var(--fin-border-divider)] perspective-1000"
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
            Structured • Beginner-First • Practical
          </motion.p>
          <motion.h1 
            variants={premiumFadeUp}
            className={`text-5xl md:text-7xl font-extrabold text-[var(--fin-text-primary)] mb-8 ${playfair.className} tracking-tight leading-tight`}
          >
            Trading Courses
          </motion.h1>
          <motion.p 
            variants={premiumFadeUp}
            className="text-xl text-[var(--fin-text-secondary)] max-w-2xl mx-auto leading-relaxed"
          >
            Master the markets step-by-step with discipline, clarity, and confidence. Our curriculum is designed for serious traders.
          </motion.p>
        </motion.div>
      </section>

      {/* COURSES GRID */}
      <section 
        className="py-24 relative"
        style={{ backgroundColor: isLight ? '#FFFFFF' : '#0F172A' }}
      >
        <motion.div
          variants={premiumStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <motion.h2
              variants={premiumFadeUp}
              className={`text-4xl md:text-5xl font-bold mb-4 text-[var(--fin-text-primary)] ${playfair.className}`}
            >
              Choose Your Learning Path
            </motion.h2>
            <motion.p variants={premiumFadeUp} className="text-lg text-[var(--fin-text-secondary)] max-w-2xl mx-auto">
              Showing {effectiveCourses.length} carefully crafted modules designed to build a solid foundation.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {loading && <div className="col-span-full text-center py-20 text-[var(--fin-text-secondary)] font-medium">Loading premium courses...</div>}
            {!loading && effectiveCourses.length === 0 && <div className="col-span-full text-center py-20 text-[var(--fin-text-secondary)]">No courses available.</div>}
            
            {effectiveCourses.map((course) => (
              <PremiumCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                badgeLabel={course.level}
                metaItems={[
                  { icon: <Clock size={16} />, label: course.duration },
                  { icon: <Book size={16} />, label: `${course.modules ?? 0} modules` },
                  { icon: <Users size={16} />, label: `${course.students_count ?? 0} active learners` }
                ]}
                price={course.price}
                priceLabel="Investment"
                actionUrl={`/signup?course=${course.id}`}
                actionLabel="Enroll Now"
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA — PREMIUM FINANCE */}
      <section 
        className="py-32 relative overflow-hidden"
        style={{ 
          backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
          borderTop: `1px solid ${isLight ? '#A38970' : '#4FD1FF'}`
        }}
      >
        {/* Decorative elements */}
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
            Not Sure Where to Start?
          </motion.h2>
          <motion.p 
            variants={premiumFadeUp}
            className="text-xl text-[var(--fin-text-primary)]/80 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Begin with the fundamentals and build a resilient investment framework over time. Excellence requires process.
          </motion.p>

          <motion.div variants={premiumFadeUp}>
            <Link
              href="/webinars"
              style={{
                backgroundColor: isLight ? '#3E3730' : '#4FD1FF',
                color: '#FFFFFF'
              }}
              className="group/cta inline-flex items-center justify-center px-10 py-5 rounded-xl font-bold text-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_20px_40px_-10px_rgba(79,209,255,0.3)] hover:-translate-y-1.5 border border-transparent relative overflow-hidden"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isLight ? '#2A2420' : '#2FA5D8'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isLight ? '#3E3730' : '#4FD1FF'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000 ease-in-out" />
              <span className="relative z-10">Join an Introductory Webinar</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}

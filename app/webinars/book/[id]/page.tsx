"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, User, Mail, Phone, Loader2, CheckCircle2 } from "lucide-react"
import { Playfair_Display } from "next/font/google"
import { premiumFadeUp, premiumStagger } from "@/lib/animations"

const playfair = Playfair_Display({ subsets: ["latin"] })

type Webinar = {
  id: string
  title: string
  date?: string
  time?: string
  instructor?: string
  description?: string
}

export default function WebinarBookingPage() {
  const { id } = useParams()
  const router = useRouter()
  const [webinar, setWebinar] = useState<Webinar | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/webinars')
        const json = await res.json()
        if (res.ok) {
          const found = json.data?.find((w: Webinar) => w.id === id)
          if (found) setWebinar(found)
        }
      } catch (err) {
        console.error('Error fetching webinar', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  // Fallback demo data if not found in DB
  const effectiveWebinar = webinar || {
    id: id as string,
    title: 'Modern Trading Foundations',
    date: 'Oct 24, 2026',
    time: '6:00 PM IST',
    instructor: 'Shobha Pujari',
    description: 'Master the core principles of price action and risk management.'
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F2E8]">
        <Loader2 className="animate-spin text-[#D1AF62]" size={48} />
      </div>
    )
  }

  return (
    <main
      style={{
        '--fin-bg-primary': '#F7F2E8',
        '--fin-bg-secondary': '#EBE5D8',
        '--fin-text-primary': '#3E3730',
        '--fin-accent-gold': '#D1AF62',
        '--fin-border-divider': '#D6CCBE'
      } as React.CSSProperties}
      className="bg-white min-h-screen transition-colors duration-500 font-sans text-[var(--fin-text-primary)]"
    >
      <Navigation />

      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--fin-bg-primary)] z-0" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--fin-accent-gold)]/40 to-transparent" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16">
          {/* CONTENT */}
          <motion.div
            variants={premiumStagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            <motion.p variants={premiumFadeUp} className="uppercase tracking-[0.2em] text-[#A38970] mb-6 font-semibold text-xs">
              Exclusive Session Registration
            </motion.p>
            <motion.h1 
              variants={premiumFadeUp}
              className={`text-5xl md:text-6xl font-extrabold mb-8 ${playfair.className} tracking-tight leading-tight`}
            >
              Secure Your Seat
            </motion.h1>
            
            <motion.div variants={premiumFadeUp} className="space-y-6 mb-10">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-[var(--fin-border-divider)] shadow-sm">
                <div className="w-12 h-12 bg-[var(--fin-bg-primary)] rounded-xl flex items-center justify-center text-[var(--fin-accent-gold)] shrink-0">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{effectiveWebinar.title}</h3>
                  <p className="text-[#645E56]">{effectiveWebinar.date} • {effectiveWebinar.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[#645E56] px-2">
                <User size={20} className="text-[var(--fin-accent-gold)]" />
                <span>Hosted by <span className="font-bold text-[var(--fin-text-primary)]">{effectiveWebinar.instructor}</span></span>
              </div>
              <div className="flex items-center gap-4 text-[#645E56] px-2">
                <MapPin size={20} className="text-[var(--fin-accent-gold)]" />
                <span>Format: <span className="font-medium text-[var(--fin-text-primary)]">Interactive Online Webinar</span></span>
              </div>
            </motion.div>

            <motion.p variants={premiumFadeUp} className="text-lg leading-relaxed text-[#645E56]">
              {effectiveWebinar.description} Join us for a deep dive into professional trading mechanics. Only limited seats available per session to ensure quality interaction.
            </motion.p>
          </motion.div>

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-3xl bg-white p-10 md:p-12 shadow-2xl border border-[var(--fin-border-divider)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--fin-bg-primary)] rounded-bl-[100px] -z-1" />
              
              {!isSuccess ? (
                <>
                  <h2 className={`text-3xl font-bold mb-4 ${playfair.className}`}>Join the Session</h2>
                  <p className="text-[#645E56] mb-8">Enter your details to receive the private access link.</p>

                  <form onSubmit={handleBooking} className="space-y-6">
                    <div>
                      <label className="text-sm font-bold mb-2 block text-[#645E56]">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="John Doe"
                        className="w-full px-5 py-4 rounded-xl border border-[var(--fin-border-divider)] focus:outline-none focus:ring-4 focus:ring-[var(--fin-accent-gold)]/10 focus:border-[var(--fin-accent-gold)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold mb-2 block text-[#645E56]">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 rounded-xl border border-[var(--fin-border-divider)] focus:outline-none focus:ring-4 focus:ring-[var(--fin-accent-gold)]/10 focus:border-[var(--fin-accent-gold)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold mb-2 block text-[#645E56]">Phone Number (Optional)</label>
                      <input 
                        type="tel" 
                        placeholder="+91 00000 00000"
                        className="w-full px-5 py-4 rounded-xl border border-[var(--fin-border-divider)] focus:outline-none focus:ring-4 focus:ring-[var(--fin-accent-gold)]/10 focus:border-[var(--fin-accent-gold)] transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 bg-[var(--fin-text-primary)] text-white rounded-xl font-bold text-lg 
                      flex items-center justify-center gap-3 hover:bg-[#2A2420] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Confirm My Spot"
                      )}
                    </button>
                    <p className="text-xs text-center text-[#A38970] mt-4">
                      By confirming, you agree to receive session reminders via email.
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-100"
                  >
                    <CheckCircle2 size={48} className="text-green-600" />
                  </motion.div>
                  <h2 className={`text-4xl font-bold mb-4 ${playfair.className}`}>Success!</h2>
                  <p className="text-lg text-[#645E56] mb-10 leading-relaxed">
                    Your seat has been reserved. Look out for an email with the access details and invitation.
                  </p>
                  <button
                    onClick={() => router.push('/webinars')}
                    className="px-8 py-4 border border-[var(--fin-border-divider)] rounded-xl font-bold hover:bg-[var(--fin-bg-primary)] transition-colors"
                  >
                    Back to Webinars
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

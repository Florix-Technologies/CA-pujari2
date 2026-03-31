"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTheme } from "@/hooks/useTheme"
import { motion } from "framer-motion"
import { Playfair_Display } from "next/font/google"
import { Calendar, Users, FileText, CheckCircle, Video, CreditCard, Sparkles } from "lucide-react"

import { premiumFadeUp, premiumStagger } from "@/lib/animations"
import { PremiumCard } from "@/components/ui/premium-card"
import { BookingModal, InquiryModal } from "@/components/ui/service-modals"
import Image from "next/image"

const playfair = Playfair_Display({ subsets: ["latin"] })

type ActiveModalProps = {
  type: 'booking' | 'inquiry' | null
  id: string
  title: string
  price?: string
}

const services = [
  {
    id: "webinar",
    title: "Live Webinar Session by SHOBHA PUJARI",
    price: "₹2,500",
    badgeLabel: "Webinar",
    description: "Join a live interactive session where real market strategies, analysis, and trading concepts are explained clearly.",
    metaItems: [
      { icon: <Calendar size={16} />, label: "View upcoming schedules" },
      { icon: <CheckCircle size={16} />, label: "Select preferred date" },
      { icon: <Video size={16} />, label: "40 minutes duration" },
    ],
    actionLabel: "Book Webinar",
    modalType: "booking" as const
  },
  {
    id: "personal-consultation",
    title: "One-on-One Consultation",
    price: "₹5,000",
    badgeLabel: "Personal",
    description: "Get personalized guidance tailored to your trading goals, mistakes, and growth strategy.",
    metaItems: [
      { icon: <Users size={16} />, label: "Book private session" },
      { icon: <FileText size={16} />, label: "Personalized discussion" },
      { icon: <Video size={16} />, label: "45–60 minutes duration" },
    ],
    actionLabel: "Book Consultation",
    modalType: "booking" as const
  },
  {
    id: "business-consultation",
    title: "In-depth Business Consultation",
    price: "₹10,000",
    badgeLabel: "Business",
    description: "Designed for individuals or businesses looking for deeper strategic insights and structured trading systems.",
    metaItems: [
      { icon: <FileText size={16} />, label: "Advanced consultation" },
      { icon: <CheckCircle size={16} />, label: "Strategy-focused discussion" },
      { icon: <Video size={16} />, label: "Flexible duration" },
    ],
    actionLabel: "Book Session",
    modalType: "booking" as const
  },
  {
    id: "custom-module",
    title: "Custom Business Module / Strategy Package",
    price: "₹100,000",
    badgeLabel: "✨ Premium Package – Contact for Details",
    description: "A high-value customized trading and business strategy package tailored for serious professionals and companies.",
    metaItems: [
      { icon: <CheckCircle size={16} />, label: "Custom strategy development" },
      { icon: <Users size={16} />, label: "Personalized mentorship" },
      { icon: <Sparkles size={16} />, label: "Scalable solutions" },
    ],
    actionLabel: "Contact Now",
    modalType: "inquiry" as const
  }
]

const pastSessions = [
  {
    id: "p1",
    title: "Introduction to Options Trading",
    description: "Recorded on: 8 Jan 2026",
    actionLabel: "Watch Recording"
  },
  {
    id: "p2",
    title: "Market Psychology 101",
    description: "Recorded on: 28 Dec 2025",
    actionLabel: "Watch Recording"
  },
  {
    id: "p3",
    title: "Technical Analysis Deep Dive",
    description: "Recorded on: 15 Dec 2025",
    actionLabel: "Watch Recording"
  }
]

export default function WebinarsPage() {
  const { isLight } = useTheme()
  const [activeModal, setActiveModal] = useState<ActiveModalProps>({ type: null, id: "", title: "", price: "" })

  const closeModal = () => setActiveModal({ type: null, id: "", title: "", price: "" })

  const handleOpenModal = (service: any) => {
    setActiveModal({
      type: service.modalType,
      id: service.id,
      title: service.title,
      price: service.price
    })
  }

  return (
    <>
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

        {/* HERO — EXPERIENCE FIRST */}
        <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden border-b border-[var(--fin-border-divider)] perspective-1000">
          <video
            src="/finance.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* dark translucent overlay so text remains readable */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

          <motion.div
            variants={premiumStagger}
            initial="hidden"
            animate="visible"
            className="relative max-w-5xl mx-auto px-6 text-center z-10"
          >
            {/* Translucent premium glass panel to improve text legibility */}
            <motion.div
              variants={premiumFadeUp}
              className="mx-auto w-full max-w-4xl rounded-3xl p-10 md:p-14 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-md"
              style={{ backgroundColor: isLight ? 'rgba(247,242,232,0.85)' : 'rgba(15,23,42,0.85)', border: isLight ? '1px solid rgba(214,204,190,0.4)' : '1px solid rgba(79,209,255,0.2)' }}
            >
              <p className="uppercase tracking-[0.2em] text-[var(--fin-text-secondary)] mb-6 font-semibold text-sm">
                Learn Live. Ask Questions. Grow Faster
              </p>

              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-[var(--fin-text-primary)] ${playfair.className} tracking-tight leading-tight`}>
                Live Trading Webinars
              </h1>

              <p className="text-xl max-w-2xl mx-auto text-[var(--fin-text-secondary)] leading-relaxed font-medium">
                Interactive sessions designed to give beginners real clarity — not recorded noise.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* SERVICES GRID */}
        <section className="py-24 relative border-b border-[var(--fin-border-divider)]" style={{ backgroundColor: isLight ? '#FFFFFF' : '#0F172A' }}>
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
                Core Services
              </motion.h2>
              <motion.p variants={premiumFadeUp} className="text-lg text-[var(--fin-text-secondary)] max-w-2xl mx-auto font-medium">
                Choose the right level of guidance and mentorship for your trading growth.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12">
              {services.map((service) => (
                <PremiumCard
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  description={service.description}
                  badgeLabel={service.badgeLabel}
                  metaItems={service.metaItems}
                  price={service.price}
                  priceLabel="Investment"
                  actionLabel={service.actionLabel}
                  onClick={() => handleOpenModal(service)}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* PAST SESSIONS SECTION */}
        <section className="py-24 relative border-t border-[var(--fin-border-divider)]" style={{ backgroundColor: isLight ? 'rgba(247,242,232,0.4)' : 'rgba(15,23,42,0.4)' }}>
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
                Past Sessions (Recorded)
              </motion.h2>
              <motion.p variants={premiumFadeUp} className="text-lg text-[var(--fin-text-secondary)] max-w-2xl mx-auto">
                Catch up on what you missed.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {pastSessions.map((session) => (
                <PremiumCard
                  key={session.id}
                  id={session.id}
                  title={session.title}
                  description={
                    <span className="font-medium text-sm">
                      {session.description}
                    </span>
                  }
                  actionLabel={session.actionLabel}
                  actionUrl="#"
                  accentColor="silver"
                  topIcon={<Video size={24} />}
                  fullWidthButton={true}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* PAYMENT — SOFT TRUST */}
        <section className="py-20 border-t border-[var(--fin-border-divider)]" style={{ backgroundColor: isLight ? '#FFFFFF' : '#0F172A' }}>
          <motion.div
            variants={premiumStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-4xl mx-auto px-6 text-center"
          >
            <motion.h2 variants={premiumFadeUp} className={`text-3xl font-bold mb-10 text-[var(--fin-text-primary)] ${playfair.className}`}>
              Simple & Secure Payments
            </motion.h2>

            <motion.div variants={premiumStagger} className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div variants={premiumFadeUp} className="rounded-2xl border border-[var(--fin-border-divider)] py-6 flex items-center justify-center shadow-sm hover:shadow-md hover:border-[var(--fin-accent-gold)] transition-all duration-300" style={{ backgroundColor: '#FFFFFF' }}>
                <Image src="/upi.svg" alt="UPI" width={72} height={72} />
              </motion.div>

              <motion.div variants={premiumFadeUp} className="rounded-2xl border border-[var(--fin-border-divider)] py-6 flex items-center justify-center shadow-sm hover:shadow-md hover:border-[var(--fin-accent-gold)] transition-all duration-300" style={{ backgroundColor: '#FFFFFF' }}>
                <Image src="/razorpay.svg" alt="Razorpay" width={96} height={48} />
              </motion.div>

              <motion.div variants={premiumFadeUp} className="rounded-2xl border border-[var(--fin-border-divider)] py-6 flex items-center justify-center shadow-sm hover:shadow-md hover:border-[var(--fin-accent-gold)] transition-all duration-300" style={{ backgroundColor: '#FFFFFF' }}>
                <Image src="/paytm.svg" alt="Paytm" width={96} height={48} />
              </motion.div>

              <motion.div variants={premiumFadeUp} className="rounded-2xl border border-[var(--fin-border-divider)] py-6 flex flex-col gap-2 items-center justify-center shadow-sm hover:shadow-md hover:border-[var(--fin-accent-gold)] transition-all duration-300 text-[#3E3730]" style={{ backgroundColor: '#FFFFFF' }}>
                <CreditCard size={40} className="text-[var(--fin-accent-gold)]" />
                <span className="text-xs font-semibold tracking-wider uppercase">Cards</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <Footer />
      </main>

      {/* Render Modals at the top level */}
      <BookingModal
        isOpen={activeModal.type === 'booking'}
        onClose={closeModal}
        serviceName={activeModal.title}
        price={activeModal.price}
      />

      <InquiryModal
        isOpen={activeModal.type === 'inquiry'}
        onClose={closeModal}
        serviceName={activeModal.title}
      />
    </>
  )
}

"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
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

const advancedPrograms = [
  {
    id: "enterprise",
    title: "Enterprise",
    price: "₹500,000",
    badgeLabel: "Professional / High-Volume Traders",
    description: "Built for professional traders looking for high-level strategies, capital management, and scaling techniques.",
    actionLabel: "Get Started",
    modalType: "booking" as const
  },
  {
    id: "ultimate",
    title: "Ultimate",
    price: "₹1,000,000",
    badgeLabel: "Lifetime / VIP Access",
    description: "Complete lifetime access with exclusive mentorship, priority support, and elite-level trading insights.",
    actionLabel: "Contact Us",
    modalType: "inquiry" as const
  }
]

export default function WebinarsPage() {
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
          '--fin-bg-primary': '#F7F2E8',
          '--fin-bg-secondary': '#EBE5D8',
          '--fin-bg-accent': '#DFD8CC',
          '--fin-gradient-hero': 'linear-gradient(90deg, #FBF8F2 0%, #F7F2E8 50%, #F5F0E6 100%)',
          '--fin-text-primary': '#3E3730',
          '--fin-text-secondary': '#645E56',
          '--fin-text-light': '#8A847C',
          '--fin-accent-gold': '#D1AF62',
          '--fin-accent-soft-gold': '#A38970',
          '--fin-border-light': '#A38970',
          '--fin-border-divider': '#D6CCBE'
        } as React.CSSProperties}
        className="bg-white min-h-screen text-[var(--fin-text-primary)] transition-colors duration-500 font-sans"
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
              style={{ backgroundColor: 'rgba(247,242,232,0.85)', border: '1px solid rgba(214,204,190,0.4)' }}
            >
              <p className="uppercase tracking-[0.2em] text-[var(--fin-text-secondary)] mb-6 font-semibold text-sm">
                Book personalized sessions and expert-led webinars to accelerate your trading journey
              </p>

              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-[var(--fin-text-primary)] ${playfair.className} tracking-tight leading-tight`}>
                Live Sessions & Consultation Services
              </h1>

              <p className="text-xl max-w-2xl mx-auto text-[var(--fin-text-secondary)] leading-relaxed font-medium">
                Interactive sessions designed to give beginners real clarity — not recorded noise.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* SERVICES GRID */}
        <section className="py-24 bg-white relative border-b border-[var(--fin-border-divider)]">
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

        {/* ADVANCED PROGRAMS SECTION */}
        <section className="py-24 bg-[var(--fin-bg-primary)]/40 relative">
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
                Advanced Programs
              </motion.h2>
              <motion.p variants={premiumFadeUp} className="text-lg text-[var(--fin-text-secondary)] max-w-2xl mx-auto">
                Exclusive high-volume and lifetime access programs for elite traders.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
              {advancedPrograms.map((program) => (
                <PremiumCard
                  key={program.id}
                  id={program.id}
                  title={program.title}
                  description={program.description}
                  badgeLabel={program.badgeLabel}
                  price={program.price}
                  priceLabel="Investment"
                  actionLabel={program.actionLabel}
                  accentColor="gold"
                  onClick={() => handleOpenModal(program)}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* PAYMENT — SOFT TRUST */}
        <section className="py-20 bg-[var(--fin-bg-primary)] border-t border-[var(--fin-border-divider)]">
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
              <motion.div variants={premiumFadeUp} className="rounded-2xl bg-white border border-[var(--fin-border-divider)] py-6 flex items-center justify-center shadow-sm hover:shadow-md hover:border-[var(--fin-accent-gold)] transition-all duration-300">
                <Image src="/upi.svg" alt="UPI" width={72} height={72} />
              </motion.div>

              <motion.div variants={premiumFadeUp} className="rounded-2xl bg-white border border-[var(--fin-border-divider)] py-6 flex items-center justify-center shadow-sm hover:shadow-md hover:border-[var(--fin-accent-gold)] transition-all duration-300">
                <Image src="/razorpay.svg" alt="Razorpay" width={96} height={48} />
              </motion.div>

              <motion.div variants={premiumFadeUp} className="rounded-2xl bg-white border border-[var(--fin-border-divider)] py-6 flex items-center justify-center shadow-sm hover:shadow-md hover:border-[var(--fin-accent-gold)] transition-all duration-300">
                <Image src="/paytm.svg" alt="Paytm" width={96} height={48} />
              </motion.div>

              <motion.div variants={premiumFadeUp} className="rounded-2xl bg-white border border-[var(--fin-border-divider)] py-6 flex flex-col gap-2 items-center justify-center shadow-sm hover:shadow-md hover:border-[var(--fin-accent-gold)] transition-all duration-300 text-[var(--fin-text-primary)]">
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

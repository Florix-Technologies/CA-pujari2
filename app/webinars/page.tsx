"use client"

import { useState, ReactNode, useRef } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/context/AuthContext"
import { motion } from "framer-motion"
import { Playfair_Display } from "next/font/google"
import { Calendar, Users, FileText, CheckCircle, Video, CreditCard, Sparkles } from "lucide-react"
import { premiumFadeUp, premiumStagger } from "@/lib/animations"
import { PremiumCard } from "@/components/ui/premium-card"
import { BookingModal, InquiryModal } from "@/components/ui/service-modals"
import Image from "next/image"

const playfair = Playfair_Display({ subsets: ["latin"] })

const ctaButton = ({ href, label, icon, isLight }: { href: string; label: string; icon: ReactNode; isLight: boolean }) => {
  const buttonStyle = {
    background: isLight ? 'linear-gradient(135deg, #d4af37, #c69c2d)' : 'linear-gradient(135deg, #4FD1FF, #3B82F6)',
    border: isLight ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(79, 209, 255, 0.3)',
    color: '#ffffff',
    boxShadow: isLight ? '0 4px 12px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(79, 209, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
  }

  return (
  <motion.a
    href={href}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    onHoverStart={(e) => {
      (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)';
    }}
    onHoverEnd={(e) => {
      (e.currentTarget as HTMLElement).style.filter = 'brightness(1)';
    }}
    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-base md:text-lg transition-all duration-300 cursor-pointer"
    style={buttonStyle}
  >
    {icon}
    {label}
  </motion.a>
)
}

const paymentMethods = [
  { src: "/upi.svg", alt: "UPI", width: 72, height: 72, isImage: true },
  { src: "/razorpay.svg", alt: "Razorpay", width: 96, height: 48, isImage: true },
  { src: "/paytm.svg", alt: "Paytm", width: 96, height: 48, isImage: true },
  { src: null, alt: "Cards", isImage: false }
]

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
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeModal, setActiveModal] = useState<ActiveModalProps>({ type: null, id: "", title: "", price: "" })
  const [activeServiceTab, setActiveServiceTab] = useState<string>("webinar")
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const closeModal = () => setActiveModal({ type: null, id: "", title: "", price: "" })

  const handleProtectedAction = (actionCallback: () => void) => {
    if (!user && !authLoading) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.hash)}`)
      return
    }
    actionCallback()
  }

  const serviceTabs = [
    { id: "webinar", label: "Webinar" },
    { id: "personal-consultation", label: "Personal" },
    { id: "business-consultation", label: "Business" },
    { id: "custom-module", label: "Premium Package" }
  ]

  const handleObjClick = (tabId: string) => {
    setActiveServiceTab(tabId)
    setTimeout(() => {
      const activeElement = document.getElementById(`service-card-${tabId}`)
      if (activeElement && scrollContainerRef.current) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }, 100)
  }

  const handleOpenModal = (service: any) => {
    handleProtectedAction(() => {
      setActiveModal({
        type: service.modalType,
        id: service.id,
        title: service.title,
        price: service.price
      })
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

        {/* HERO — PREMIUM FINTECH REDESIGN */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[var(--fin-border-divider)] perspective-1000">
          <video
            src={isLight ? '/finance.mp4' : '/videodark.mp4'}
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
          >
            {/* Premium Octagon Card Container with Overlapping Images */}
            <div className="relative md:min-h-[180px]">
              {/* Main Card with Octagon Shape - Clean, Single Layer */}
              <motion.div
                variants={premiumFadeUp}
                className="relative w-full md:min-h-[180px] overflow-visible z-20"
                style={{ 
                  background: isLight ? 'linear-gradient(135deg, #F4EFE6, #E9DFCF)' : 'linear-gradient(135deg, #1A2847, #0F172A)',
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                  borderRadius: '60px',
                  border: isLight ? '3px double #D4A574' : '3px double #4FD1FF',
                  boxShadow: isLight ? '0 20px 60px rgba(0,0,0,0.35), 0 10px 30px rgba(139,69,19,0.2), inset 0 1px 0 rgba(255,255,255,0.6)' : '0 20px 60px rgba(0,0,0,0.5), 0 10px 30px rgba(79,209,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                  position: 'relative'
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
                        color: isLight ? '#9B8D7B' : '#A5B4FC'
                      }}
                    >
                      Learn Live. Ask Questions. Grow Faster
                    </motion.p>

                    <motion.h1
                      variants={premiumFadeUp}
                      className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 ${playfair.className} tracking-tight leading-tight`}
                      style={{
                        color: isLight ? '#3E352C' : '#E0E7FF'
                      }}
                    >
                      Live Trading Webinars
                    </motion.h1>

                    <motion.p
                      variants={premiumFadeUp}
                      className="text-sm md:text-base lg:text-lg leading-relaxed font-medium mb-4"
                      style={{
                        color: isLight ? '#6B6258' : '#C7D2FE'
                      }}
                    >
                      Join interactive sessions designed to give beginners real clarity in live trading — not recorded noise.
                    </motion.p>

                    {/* Button Half-Box Container */}
                    <motion.div 
                      variants={premiumFadeUp}
                      className="mt-6 -mx-12 md:-mx-16 pt-6 border-t-2 border-b-2"
                      style={{
                        borderColor: isLight ? '#D4A574' : '#4FD1FF',
                        backgroundColor: isLight ? '#F0EDEA' : 'rgba(26, 40, 71, 0.8)'
                      }}
                    >
                      <div className="px-12 md:px-16 pb-6">
                        <motion.p
                          variants={premiumFadeUp}
                          className="text-base md:text-lg font-semibold mb-4 text-center"
                          style={{
                            color: isLight ? 'var(--fin-text-primary)' : '#E0E7FF'
                          }}
                        >
                          Check out our
                        </motion.p>

                        {/* PREMIUM GRADIENT BUTTONS */}
                        <motion.div 
                          variants={premiumFadeUp}
                          className="flex flex-col sm:flex-row gap-3 items-center justify-center"
                        >
                          {ctaButton({
                            href: "#core-services",
                            label: "Core Services",
                            isLight,
                            icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" /><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" clipRule="evenodd" /></svg>
                          })}
                          {ctaButton({
                            href: "#past-sessions",
                            label: "Past Sessions",
                            isLight,
                            icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" /></svg>
                          })}
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Subtle subtle ambient glow - minimal */}

              {/* LEFT: Robot Image - Above Card */}
              <motion.div
                variants={premiumFadeUp}
                className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2/5 z-50"
              >
                <div 
                  className="relative w-[430px] h-[500px]"
                  style={{
                    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.15))'
                  }}
                >
                  <Image
                    src={isLight ? "/womentrading.png" : "/women trading.png"}
                    alt="Trading Professional"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>

              {/* RIGHT: Candlestick Image - Above Card */}
              <motion.div
                variants={premiumFadeUp}
                className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-2/5 z-50"
              >
                <div 
                  className="relative w-52 h-72"
                  style={{
                    mixBlendMode: 'soft-light',
                    opacity: 0.85,
                    filter: 'brightness(0.95) drop-shadow(0 8px 24px rgba(0,0,0,0.12))'
                  }}
                >
                  <Image
                    src={isLight ? '/candlestick.png' : '/candlestickd.png'}
                    alt="Market Candlesticks"
                    fill
                    className="object-contain"
                    style={{
                      filter: 'blur(0.3px)'
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* SERVICES GRID */}
        <section id="core-services" className="py-24 relative border-b border-[var(--fin-border-divider)] scroll-mt-20" style={{ background: isLight ? 'radial-gradient(circle at 50% 40%, rgba(0,0,0,0.03), transparent 60%), linear-gradient(180deg, #f8f5f0 0%, #efe6da 100%)' : '#0F172A' }}>
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
                className={`text-5xl md:text-6xl font-bold mb-4 text-[var(--fin-text-primary)] ${playfair.className}`}
                style={{ color: isLight ? 'var(--fin-text-primary)' : '#E0E7FF' }}
              >
                Core Services
              </motion.h2>
              <motion.p variants={premiumFadeUp} className="text-xl text-[var(--fin-text-secondary)] max-w-2xl mx-auto font-medium" style={{ color: isLight ? 'var(--fin-text-secondary)' : '#C7D2FE' }}>
                Choose the right level of guidance and mentorship for your trading growth.
              </motion.p>
            </div>

            {/* Service Filter Tabs */}
            <motion.div
              variants={premiumFadeUp}
              className="flex justify-center mb-12"
            >
              {serviceTabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => handleObjClick(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 font-semibold text-sm md:text-base transition-all duration-300"
                  style={{
                    background: activeServiceTab === tab.id 
                      ? isLight ? 'linear-gradient(135deg, #d4af37, #c69c2d)' : 'linear-gradient(135deg, #4FD1FF, #3B82F6)'
                      : isLight ? '#f1e8dc' : '#334155',
                    color: activeServiceTab === tab.id
                      ? '#ffffff'
                      : isLight ? '#6b5b4d' : '#CBD5E1',
                    border: `2px solid ${activeServiceTab === tab.id 
                      ? isLight ? '#d4af37' : '#4FD1FF'
                      : isLight ? '#e5d9c8' : '#475569'}`,
                    borderRadius: index === 0 ? '50px 0 0 50px' : index === serviceTabs.length - 1 ? '0 50px 50px 0' : '0',
                    marginLeft: index > 0 ? '-2px' : '0',
                    boxShadow: activeServiceTab === tab.id 
                      ? isLight ? '0 4px 12px rgba(212, 175, 55, 0.3)' : '0 4px 12px rgba(79, 209, 255, 0.3)'
                      : 'none'
                  }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </motion.div>

            {/* Horizontal Scrollable Services */}
            <div className="relative">
              {/* Scrollable Container */}
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
              >
                <motion.div
                  className="flex gap-6 pb-4 px-16 items-start"
                  variants={premiumStagger}
                  initial="hidden"
                  animate="visible"
                >
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      id={`service-card-${service.id}`}
                      onClick={() => handleObjClick(service.id)}
                      className="flex-shrink-0 cursor-pointer transition-all duration-300"
                      style={{
                        width: activeServiceTab === service.id ? '900px' : '350px',
                        minWidth: activeServiceTab === service.id ? '900px' : '350px',
                        border: activeServiceTab === service.id ? `3px solid ${isLight ? '#D1AF62' : '#4FD1FF'}` : 'none',
                        borderRadius: '16px',
                        boxShadow: activeServiceTab === service.id ? isLight ? '0 0 20px rgba(209, 175, 98, 0.4)' : '0 0 20px rgba(79, 209, 255, 0.4)' : 'none'
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <PremiumCard
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
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* PAST SESSIONS SECTION */}
        <section id="past-sessions" className="py-24 relative border-t border-[var(--fin-border-divider)] scroll-mt-20" style={{ backgroundColor: isLight ? 'rgba(247,242,232,0.4)' : 'rgba(15,23,42,0.4)' }}>
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
                className={`text-5xl md:text-6xl font-bold mb-4 text-[var(--fin-text-primary)] ${playfair.className}`}
                style={{ color: isLight ? 'var(--fin-text-primary)' : '#E0E7FF' }}
              >
                Past Sessions (Recorded)
              </motion.h2>
              <motion.p variants={premiumFadeUp} className="text-xl text-[var(--fin-text-secondary)] max-w-2xl mx-auto" style={{ color: isLight ? 'var(--fin-text-secondary)' : '#C7D2FE' }}>
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
            <motion.h2 variants={premiumFadeUp} className={`text-4xl md:text-5xl font-bold mb-10 text-[var(--fin-text-primary)] ${playfair.className}`} style={{ color: isLight ? 'var(--fin-text-primary)' : '#E0E7FF' }}>
              Simple & Secure Payments
            </motion.h2>

            <motion.div variants={premiumStagger} className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {paymentMethods.map((method, idx) => (
                <motion.div key={idx} variants={premiumFadeUp} className="rounded-2xl border border-[var(--fin-border-divider)] py-6 flex items-center justify-center shadow-sm hover:shadow-md hover:border-[var(--fin-accent-gold)] transition-all duration-300" style={{ backgroundColor: '#FFFFFF' }}>
                  {method.isImage ? (
                    <Image src={method.src!} alt={method.alt} width={method.width} height={method.height} />
                  ) : (
                    <div className="flex flex-col gap-2 items-center justify-center text-[#3E3730]">
                      <CreditCard size={40} className="text-[var(--fin-accent-gold)]" />
                      <span className="text-xs font-semibold tracking-wider uppercase">{method.alt}</span>
                    </div>
                  )}
                </motion.div>
              ))}
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

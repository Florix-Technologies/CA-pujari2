"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTheme } from "@/hooks/useTheme"
import { Mail, Linkedin, Youtube, Phone, MapPin, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeUp, stagger } from "@/lib/animations"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })

// Premium Easing Curve
const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1]

// Contact Validation Schema
const contactSchema = z.object({
  fullName: z.string().trim().min(3, "Name must be at least 3 characters").regex(/[^\s]/, "Name cannot be just spaces"),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"),
  subject: z.string().trim().min(5, "Subject must be at least 5 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const { isLight } = useTheme()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched", // Trigger validation on blur
  })

  const onSubmit = async (data: ContactFormValues) => {
    // Simulate secure network request duration
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSuccess(true)
  }

  // Smooth Error Component
  const ErrorMessage = ({ message }: { message?: string }) => (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -10 }}
          transition={{ duration: 0.3, ease: premiumEasing }}
          className="text-red-600 text-sm mt-2 flex items-center gap-1.5 font-medium origin-top"
        >
          <AlertCircle size={14} />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )

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
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden border-b border-[var(--fin-border-divider)] perspective-1000">
        <motion.div 
          style={{ background: 'var(--fin-gradient-hero)' }}
          className="absolute inset-0 z-0 will-change-transform"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)", y: 20 }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.2, ease: premiumEasing }}
          className="relative max-w-5xl mx-auto px-6 text-center z-10"
        >
          <p className="uppercase tracking-[0.2em] text-[var(--fin-text-secondary)] mb-6 font-semibold text-sm">
            Let’s Talk
          </p>
          <h1 className={`text-5xl md:text-7xl font-extrabold text-[var(--fin-text-primary)] mb-8 tracking-tight ${playfair.className}`}>
            Get in Touch
          </h1>
          <p className="text-xl text-[var(--fin-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Questions, collaborations, or learning guidance — I’d love to hear from you.
          </p>
        </motion.div>
      </section>

      {/* CONTACT INFO — FLOATING TRUST */}
      <section 
        className="py-24"
        style={{ backgroundColor: isLight ? '#FFFFFF' : '#0F172A' }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10"
        >
          {[
            { icon: Mail, title: "Email", value: "shobha@tradingacademy.com" },
            { icon: Phone, title: "Phone", value: "+91 98765 43210" },
            { icon: MapPin, title: "Location", value: "Mumbai, India" },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.5, ease: premiumEasing }}
                className="group relative flex flex-col rounded-2xl bg-[var(--fin-bg-primary)] p-10 text-center border shadow-sm transition-all duration-500 will-change-transform overflow-hidden"
                style={{
                  backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
                  borderColor: isLight ? 'var(--fin-border-light)' : '#4FD1FF'
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: isLight
                      ? 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)'
                      : 'linear-gradient(to bottom, rgba(79,209,255,0.1), transparent)'
                  }}
                />
                <div 
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 border transition-colors duration-500 relative z-10"
                  style={{
                    backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                    borderColor: isLight ? 'var(--fin-border-divider)' : '#4FD1FF'
                  }}
                >
                  <Icon className="text-[var(--fin-accent-gold)] group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" size={26} />
                </div>
                <h3 className={`font-bold text-2xl mb-3 text-[var(--fin-text-primary)] relative z-10 ${playfair.className}`}>{item.title}</h3>
                <p className="text-[var(--fin-text-secondary)] relative z-10 font-medium">{item.value}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* MESSAGE FORM — PREMIUM VALIDATION & UX */}
      <section 
        className="py-32 border-t border-[var(--fin-border-divider)] relative"
        style={{ backgroundColor: isLight ? '#FFFFFF' : '#0F172A' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: premiumEasing }}
          className="max-w-3xl mx-auto px-6"
        >
          <div 
            className="rounded-3xl p-10 md:p-14 shadow-xl border relative min-h-[600px] flex flex-col justify-center"
            style={{
              backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
              borderColor: isLight ? 'var(--fin-border-light)' : '#4FD1FF'
            }}
          >
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, ease: premiumEasing }}
                  className="w-full"
                >
                  <h2 className={`text-4xl font-bold mb-4 text-[var(--fin-text-primary)] tracking-tight ${playfair.className}`}>Send a Message</h2>
                  <p className="text-[var(--fin-text-secondary)] mb-10 text-lg leading-relaxed">
                    I personally read every message and reply as soon as possible.
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Name */}
                      <div className="relative group">
                        <label className="text-sm font-bold mb-2 block text-[var(--fin-text-secondary)] group-focus-within:text-[var(--fin-accent-gold)] transition-colors duration-300">
                          Full Name
                        </label>
                        <input
                          {...register("fullName")}
                          type="text"
                          placeholder="Your name"
                          style={{
                            backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                            color: isLight ? 'var(--fin-text-primary)' : '#E0E7FF'
                          }}
                          className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-4 ${
                            errors.fullName 
                              ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" 
                              : "border-[var(--fin-border-divider)] hover:border-[var(--fin-accent-gold)]/50 focus:border-[var(--fin-accent-gold)] focus:ring-[var(--fin-accent-gold)]/20"
                          }`}
                        />
                        <ErrorMessage message={errors.fullName?.message} />
                      </div>

                      {/* Email */}
                      <div className="relative group">
                        <label className="text-sm font-bold mb-2 block text-[var(--fin-text-secondary)] group-focus-within:text-[var(--fin-accent-gold)] transition-colors duration-300">
                          Email
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="you@example.com"
                          style={{
                            backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                            color: isLight ? 'var(--fin-text-primary)' : '#E0E7FF'
                          }}
                          className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-4 ${
                            errors.email 
                              ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" 
                              : "border-[var(--fin-border-divider)] hover:border-[var(--fin-accent-gold)]/50 focus:border-[var(--fin-accent-gold)] focus:ring-[var(--fin-accent-gold)]/20"
                          }`}
                        />
                        <ErrorMessage message={errors.email?.message} />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="relative group">
                      <label className="text-sm font-bold mb-2 block text-[var(--fin-text-secondary)] group-focus-within:text-[var(--fin-accent-gold)] transition-colors duration-300">
                        Subject
                      </label>
                      <input
                        {...register("subject")}
                        type="text"
                        placeholder="What would you like to talk about?"
                        style={{
                          backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                          color: isLight ? 'var(--fin-text-primary)' : '#E0E7FF'
                        }}
                        className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-4 ${
                          errors.subject 
                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" 
                            : "border-[var(--fin-border-divider)] hover:border-[var(--fin-accent-gold)]/50 focus:border-[var(--fin-accent-gold)] focus:ring-[var(--fin-accent-gold)]/20"
                        }`}
                      />
                      <ErrorMessage message={errors.subject?.message} />
                    </div>

                    {/* Message */}
                    <div className="relative group">
                      <label className="text-sm font-bold mb-2 block text-[var(--fin-text-secondary)] group-focus-within:text-[var(--fin-accent-gold)] transition-colors duration-300">
                        Message
                      </label>
                      <textarea
                        {...register("message")}
                        rows={6}
                        placeholder="Write your message here..."
                        style={{
                          backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                          color: isLight ? 'var(--fin-text-primary)' : '#E0E7FF'
                        }}
                        className={`w-full px-5 py-4 rounded-xl border resize-none transition-all duration-300 focus:outline-none focus:ring-4 ${
                          errors.message 
                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" 
                            : "border-[var(--fin-border-divider)] hover:border-[var(--fin-accent-gold)]/50 focus:border-[var(--fin-accent-gold)] focus:ring-[var(--fin-accent-gold)]/20"
                        }`}
                      />
                      <ErrorMessage message={errors.message?.message} />
                    </div>

                    {/* Submit Handler */}
                    <motion.button
                      whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(62, 55, 48, 0.1), 0 10px 10px -5px rgba(62, 55, 48, 0.04)" }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 relative overflow-hidden ${
                         isSubmitting ? "bg-[var(--fin-accent-gold)]/80 text-white/80 cursor-not-allowed" : "bg-[var(--fin-accent-gold)] text-white shadow-lg shadow-[var(--fin-accent-gold)]/20"
                      }`}
                    >
                      {/* Loading state internal spinner */}
                      <AnimatePresence>
                        {isSubmitting && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5, x: -10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                          >
                            <Loader2 size={24} className="animate-spin" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {isSubmitting ? "Sending Securely..." : "Send Message"}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: premiumEasing }}
                  className="w-full h-full flex flex-col items-center justify-center text-center py-20"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                    className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border-8 border-green-100"
                  >
                    <CheckCircle2 size={48} className="text-green-600" />
                  </motion.div>
                  <h3 className={`text-4xl font-bold mb-4 text-[var(--fin-text-primary)] tracking-tight ${playfair.className}`}>Message Sent Successfully!</h3>
                  <p className="text-xl text-[var(--fin-text-secondary)] font-medium mb-10 max-w-sm leading-relaxed">
                    Thank you for reaching out. I'll review your details and be in touch shortly.
                  </p>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      reset()
                      setIsSuccess(false)
                    }}
                    style={{
                      backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                      borderColor: isLight ? 'var(--fin-border-light)' : '#4FD1FF',
                      color: isLight ? 'var(--fin-text-primary)' : '#E0E7FF'
                    }}
                    className="px-8 py-4 border font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* SOCIAL — CREATOR PRESENCE */}
      <section 
        className="py-24 border-t border-[var(--fin-border-divider)]"
        style={{ backgroundColor: isLight ? '#FFFFFF' : '#0F172A' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-sm font-bold mb-8 tracking-[0.2em] uppercase text-[var(--fin-text-light)]">
            Connect With Me
          </h2>

          <div className="flex justify-center gap-8">
            {[
              { icon: Linkedin, link: "https://linkedin.com" },
              { icon: Youtube, link: "https://youtube.com" },
              { icon: Mail, link: "mailto:shobha@tradingacademy.com" },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.a
                  key={i}
                  href={item.link}
                  whileHover={{ scale: 1.15, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-16 h-16 bg-[var(--fin-bg-primary)] border border-[var(--fin-border-light)] text-[var(--fin-text-primary)] hover:border-[var(--fin-accent-gold)] hover:text-[var(--fin-accent-gold)] hover:shadow-lg
                  rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <Icon size={26} />
                </motion.a>
              )
            })}
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}

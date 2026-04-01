"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTheme } from "@/hooks/useTheme"
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle, Loader2, ArrowUpRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })
const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1]

const contactSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
})
type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const { isLight } = useTheme()

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
  })

  const onSubmit = async (_data: ContactFormValues) => {
    await new Promise(r => setTimeout(r, 1500))
    setIsSuccess(true)
  }

  const ErrorMessage = ({ message }: { message?: string }) => (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, height: 0, y: -6 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -6 }}
          transition={{ duration: 0.25, ease: premiumEasing }}
          className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5 font-medium"
        >
          <AlertCircle size={12} />{message}
        </motion.p>
      )}
    </AnimatePresence>
  )

  const glassBase = isLight
    ? {
        background: "rgba(255,248,232,0.52)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        border: "1px solid rgba(180,140,60,0.22)",
        boxShadow: "0 8px 32px rgba(160,120,40,0.12), inset 0 1px 0 rgba(255,255,255,0.7)",
      }
    : {
        background: "rgba(8,16,32,0.58)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        border: "1px solid rgba(80,140,255,0.12)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(120,180,255,0.06)",
      }

  const glassInput = isLight
    ? {
        background: "rgba(255,252,240,0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(180,140,60,0.28)",
        color: "#2E200A",
      }
    : {
        background: "rgba(6,12,26,0.60)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(80,140,255,0.14)",
        color: "#D8E8FF",
      }

  const textPrimary   = isLight ? "#2E200A" : "#D8E8FF"
  const textSecondary = isLight ? "#6B4E1C" : "#7A9CC8"
  const accent        = isLight ? "#8B5E14" : "#D4A040"

  return (
    <main
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: isLight
          ? "linear-gradient(135deg,#F8EED6 0%,#EFE1C0 50%,#EAD9B4 100%)"
          : "linear-gradient(135deg,#080F1C 0%,#0C1829 50%,#0F2040 100%)",
      }}
    >

      {/* ── Ambient glow blobs ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-32 -right-32 sm:-top-48 sm:-right-48 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full blur-3xl"
          style={{ background: isLight ? "rgba(200,160,60,0.16)" : "rgba(30,80,180,0.18)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 sm:-bottom-48 sm:-left-48 w-[280px] sm:w-[550px] h-[280px] sm:h-[550px] rounded-full blur-3xl"
          style={{ background: isLight ? "rgba(180,130,40,0.12)" : "rgba(20,50,130,0.14)" }}
        />
        <svg className="hidden md:block absolute top-0 right-0 w-48 lg:w-64 h-48 lg:h-64 opacity-10" viewBox="0 0 200 200" fill="none">
          <path d="M180 10 L180 80 L120 80 L120 140 L60 140" stroke={accent} strokeWidth="1"/>
          <circle cx="180" cy="10" r="4" fill={accent}/>
          <circle cx="60"  cy="140" r="4" fill={accent}/>
        </svg>
        <svg className="hidden md:block absolute bottom-0 left-0 w-48 lg:w-64 h-48 lg:h-64 opacity-10" viewBox="0 0 200 200" fill="none">
          <path d="M20 190 L20 120 L80 120 L80 60 L140 60" stroke={accent} strokeWidth="1"/>
          <circle cx="20"  cy="190" r="4" fill={accent}/>
          <circle cx="140" cy="60"  r="4" fill={accent}/>
        </svg>
      </div>

      {/* ── All page content sits above watermark ── */}
      <div className="relative z-10">
        <Navigation />

        {/* ══ HERO ══ */}
        <section className="relative flex flex-col items-center justify-center text-center min-h-[75vh] sm:min-h-[80vh] px-4 sm:px-6 pt-24 sm:pt-32 pb-40 sm:pb-52 overflow-hidden">

          {/* CONTACT watermark — scrolls with page, centered behind hero text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: premiumEasing }}
            className="absolute inset-0 flex items-end justify-center pointer-events-none select-none overflow-hidden pb-4"
            aria-hidden="true"
          >
            <span
              className="font-black uppercase leading-none tracking-[0.10em] sm:tracking-[0.15em] whitespace-nowrap"
              style={{
                fontSize: "clamp(3.5rem, 13vw, 10rem)",
                fontFamily: playfair.style.fontFamily,
                color: isLight
                  ? "rgba(100, 65, 8, 0.10)"
                  : "rgba(255, 210, 100, 0.07)",
              }}
            >
              CONTACT
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: premiumEasing }}
            className="max-w-3xl mx-auto w-full"
          >
            <p
              className="uppercase tracking-[0.20em] sm:tracking-[0.26em] text-[10px] sm:text-xs font-bold mb-4 sm:mb-5"
              style={{ color: textSecondary }}
            >
              Let&apos;s Talk
            </p>
            <h1
              className={`text-[2.6rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-5 sm:mb-7 tracking-tight ${playfair.className}`}
              style={{ color: textPrimary }}
            >
              Get in Touch
            </h1>
            <p
              className="text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mx-auto px-2"
              style={{ color: textSecondary }}
            >
              Questions, collaborations, or learning guidance — I&apos;d love to hear from you.
            </p>
          </motion.div>

          {/* bottom fade */}
          <div
            className="absolute bottom-0 inset-x-0 h-20 sm:h-28 pointer-events-none"
            style={{
              background: isLight
                ? "linear-gradient(to bottom,transparent,#EFE1C0)"
                : "linear-gradient(to bottom,transparent,#0C1829)",
            }}
          />
        </section>

        {/* ══ MAIN TWO-COLUMN ══ */}
        <section className="relative pt-14 sm:pt-20 pb-32 sm:pb-44 lg:pb-52 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-start lg:items-center">

            {/* LEFT – Info */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: premiumEasing }}
            >
              {/* Contact pill */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: premiumEasing }}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-5 sm:mb-7"
                style={{ ...(glassBase as React.CSSProperties), color: accent }}
              >
                <MapPin size={12} />
                Contact
              </motion.div>

              <p
                className="text-sm sm:text-base mb-7 sm:mb-10 leading-relaxed max-w-xs sm:max-w-sm"
                style={{ color: textSecondary }}
              >
                Have questions or ready to transform your trading journey?
                We&apos;d love to hear from you.
              </p>

              {/* Info cards */}
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: Mail,   title: "Email us",     value: "admin@cashobha.in" },
                  { icon: Phone,  title: "Call us",      value: "+91 98765 43210" },
                  { icon: MapPin, title: "Our location", value: "Mumbai, India" },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16, scale: 0.97 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, delay: i * 0.08, ease: premiumEasing }}
                      whileHover={{ y: -3, scale: 1.015 }}
                      className="flex items-center justify-between p-3.5 sm:p-4 md:p-5 rounded-2xl cursor-pointer group"
                      style={glassBase as React.CSSProperties}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: isLight ? "rgba(180,140,60,0.12)" : "rgba(255,230,140,0.08)" }}
                        >
                          <Icon size={15} style={{ color: accent }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: accent }}>
                            {item.title}
                          </p>
                          <p className="text-xs sm:text-sm font-medium truncate" style={{ color: textPrimary }}>
                            {item.value}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight
                        size={14}
                        className="opacity-30 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 ml-2"
                        style={{ color: accent }}
                      />
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* RIGHT – Form */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: premiumEasing }}
            >
              <div
                className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-10"
                style={glassBase as React.CSSProperties}
              >
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: premiumEasing }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-3 sm:space-y-4"
                    >
                      <div>
                        <input
                          {...register("name")}
                          type="text"
                          placeholder="Name"
                          className="w-full px-4 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base focus:outline-none transition-all duration-300 placeholder:opacity-50"
                          style={{
                            ...(glassInput as React.CSSProperties),
                            ...(errors.name ? { borderColor: "rgba(239,68,68,0.55)" } : {}),
                          }}
                        />
                        <ErrorMessage message={errors.name?.message} />
                      </div>

                      <div>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="Email"
                          className="w-full px-4 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base focus:outline-none transition-all duration-300 placeholder:opacity-50"
                          style={{
                            ...(glassInput as React.CSSProperties),
                            ...(errors.email ? { borderColor: "rgba(239,68,68,0.55)" } : {}),
                          }}
                        />
                        <ErrorMessage message={errors.email?.message} />
                      </div>

                      <div>
                        <textarea
                          {...register("message")}
                          rows={6}
                          placeholder="Message"
                          className="w-full px-4 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base focus:outline-none transition-all duration-300 resize-none placeholder:opacity-50"
                          style={{
                            ...(glassInput as React.CSSProperties),
                            ...(errors.message ? { borderColor: "rgba(239,68,68,0.55)" } : {}),
                          }}
                        />
                        <ErrorMessage message={errors.message?.message} />
                      </div>

                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 mt-1 transition-all"
                        style={{
                          background: isLight ? "#2E200A" : "#F0DFB8",
                          color: isLight ? "#F0DFB8" : "#1C1206",
                          opacity: isSubmitting ? 0.75 : 1,
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                        }}
                      >
                        {isSubmitting && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Loader2 size={16} className="animate-spin" />
                          </motion.span>
                        )}
                        {isSubmitting ? "Sending…" : "Submit"}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: premiumEasing }}
                      className="flex flex-col items-center justify-center text-center py-10 sm:py-14"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.1 }}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-5"
                        style={{ background: isLight ? "rgba(180,140,60,0.14)" : "rgba(255,230,140,0.09)" }}
                      >
                        <CheckCircle2 size={30} style={{ color: accent }} />
                      </motion.div>
                      <h3
                        className={`text-2xl sm:text-3xl font-bold mb-3 tracking-tight ${playfair.className}`}
                        style={{ color: textPrimary }}
                      >
                        Message Sent!
                      </h3>
                      <p className="mb-6 text-xs sm:text-sm leading-relaxed max-w-xs" style={{ color: textSecondary }}>
                        I&apos;ll review your message and get back to you shortly.
                      </p>
                      <button
                        onClick={() => { reset(); setIsSuccess(false) }}
                        className="px-5 py-2.5 sm:py-3 rounded-xl font-semibold text-sm transition-all"
                        style={{ ...(glassBase as React.CSSProperties), color: textPrimary }}
                      >
                        Send another message
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}

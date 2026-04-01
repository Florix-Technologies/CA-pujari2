"use client"

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { useTheme } from "@/hooks/useTheme"
import { Playfair_Display } from "next/font/google"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useRef, useState } from "react"

const playfair = Playfair_Display({ subsets: ["latin"] })

const premiumEasing = [0.22, 1, 0.36, 1]

const premiumFadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: premiumEasing } }
}

const premiumStagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const microPop = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: premiumEasing } }
}

export function PremiumCard({
  id,
  title,
  description,
  badgeLabel,
  price,
  priceLabel,
  actionUrl = "#",
  actionLabel = "Enroll Now",
  topIcon,
  metaItems = [],
  fullWidthButton = false,
  footerBorderHover = "",
  accentColor = "gold"
}: any) {
  const { isLight } = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Theme-aware colors
  const cardBg = isLight
    ? "linear-gradient(135deg, #FFFFFF 0%, #F7F2E8 100%)"
    : "linear-gradient(135deg, #1A2847 0%, #0F172A 100%)"
  const borderColor = isLight ? "rgba(209,175,98,0.3)" : "rgba(79,209,255,0.25)"
  const borderHoverColor = isLight ? "rgba(209,175,98,0.8)" : "rgba(79,209,255,0.7)"
  const accent = isLight ? "#D1AF62" : "#4FD1FF"
  const textPrimary = isLight ? "#3E3730" : "#E0E7FF"
  const textMuted = isLight ? "#7A6F65" : "#8899AA"
  const glowColor = isLight
    ? "rgba(209,175,98,0.15)"
    : "rgba(79,209,255,0.12)"

  // Raw mouse values
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // Cursor position for glow (0–100%)
  const glowX = useMotionValue(50)
  const glowY = useMotionValue(50)

  // Spring-smoothed tilt
  const rotateX = useSpring(useTransform(rawY, [-120, 120], [10, -10]), {
    stiffness: 180,
    damping: 20
  })
  const rotateY = useSpring(useTransform(rawX, [-120, 120], [-10, 10]), {
    stiffness: 180,
    damping: 20
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    rawX.set(e.clientX - centerX)
    rawY.set(e.clientY - centerY)

    // Glow position as percentage within card
    glowX.set(((e.clientX - rect.left) / rect.width) * 100)
    glowY.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
    glowX.set(50)
    glowY.set(50)
    setIsHovered(false)
  }

  const handleMouseEnter = () => setIsHovered(true)

  return (
    <motion.div
      key={id}
      variants={premiumFadeUp}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.5, ease: premiumEasing }}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 will-change-transform"
      style={{
        backgroundColor: isLight ? '#FFFFFF' : '#1F3A50',
        border: isLight ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(79,209,255,0.1)',
        boxShadow: isLight ? '0 8px 24px rgba(0,0,0,0.04)' : '0 8px 24px rgba(79,209,255,0.08)'
      }}
    >
      {/* Subtle internal atmospheric glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: isLight
            ? 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)'
            : 'linear-gradient(to bottom, rgba(79,209,255,0.1), transparent)'
        }}
      />

      {/* Clean top accent bar */}
      <div
        className="h-2 w-full transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          backgroundColor: isLight ? '#D1AF62' : '#4FD1FF',
        }}
      />

      <div
        className="p-8 md:p-10 flex flex-col relative z-10 transition-colors duration-500"
        style={{
          backgroundColor: isLight ? '#FFFFFF' : '#1F3A50',
          color: isLight ? '#2c241f' : '#E0E7FF'
        }}
      >

        {/* Top Icon Area */}
        {topIcon && (
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-sm border" style={{ backgroundColor: isLight ? '#f0ede8' : 'rgba(79,209,255,0.1)', borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(79,209,255,0.2)', color: isLight ? '#D1AF62' : '#4FD1FF' }}>
            {topIcon}
          </div>
        )}

        {/* BADGE TAG */}
        {badgeLabel && (
          <motion.span
            variants={premiumStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-8 text-xs font-bold uppercase tracking-wider rounded-full w-fit shadow-sm"
            style={{
              backgroundColor: isLight ? 'rgba(209, 175, 98, 0.08)' : 'rgba(79, 209, 255, 0.1)',
              color: isLight ? '#D1AF62' : '#4FD1FF',
              borderColor: isLight ? 'rgba(209, 175, 98, 0.2)' : 'rgba(79, 209, 255, 0.2)',
              borderWidth: '1px'
            }}
          >
            {badgeLabel}
          </motion.span>
        )}

        {/* TITLE */}
        <h3 className={`text-2xl md:text-3xl font-bold mb-4 leading-snug ${playfair.className}`} style={{ color: isLight ? '#2c241f' : '#E0E7FF' }}>
          {title}
        </h3>

        {/* DESCRIPTION */}
        {description && (
          <div className="text-[var(--fin-text-secondary)] mb-6 leading-relaxed font-medium" style={{ color: isLight ? '#6b5b4d' : '#C7D2FE' }}>
            {description}
          </div>
        )}

        {/* META ITEMS */}
        {metaItems.length > 0 && (
          <motion.div
            variants={premiumStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3 text-sm mb-6 font-medium"
            style={{ color: isLight ? '#6b5b4d' : '#C7D2FE' }}
          >
            {metaItems.map((meta, i) => (
              <div key={i} className="flex items-center gap-3">
                <motion.div variants={microPop}>
                  <div style={{ color: isLight ? '#D1AF62' : '#4FD1FF' }}>
                    {meta.icon}
                  </div>
                </motion.div>
                <motion.span variants={premiumFadeUp}>{meta.label}</motion.span>
              </div>
            ))}
          </motion.div>
        )}

        {/* FOOTER */}
        <motion.div
          variants={premiumStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`mt-auto pt-6 transition-colors duration-500 flex gap-8 ${fullWidthButton ? 'items-center pt-4' : 'items-center justify-between'} ${footerBorderHover}`}
          style={{
            borderTop: isLight ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(79,209,255,0.1)'
          }}
        >
          {price !== undefined && !fullWidthButton && (
            <div>
              <p className="text-xs uppercase tracking-widest mb-1 font-semibold" style={{ color: isLight ? '#9c8b75' : '#A5B4FC' }}>{priceLabel}</p>
              <motion.p variants={premiumFadeUp} className="text-2xl font-bold" style={{ color: isLight ? '#2c241f' : '#E0E7FF' }}>
                {price}
              </motion.p>
            </div>
          )}

          {/* CTA BUTTON */}
          <Link
            href={actionUrl}
            className={`group/btn px-6 py-3 border rounded-xl font-semibold flex items-center gap-2 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-md hover:-translate-y-1 ml-auto ${fullWidthButton ? 'w-full justify-center' : ''}`}
            style={{
              backgroundColor: isLight ? '#ffffff' : '#0F172A',
              borderColor: isLight ? '#d4af37' : '#4FD1FF',
              color: isLight ? (accentColor === "gold" ? '#2c241f' : '#6b5b4d') : '#E0E7FF',
              fontWeight: '600'
            }}
          >
            {actionLabel}
            <ArrowRight
              size={16}
              className="transform group-hover/btn:translate-x-1.5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ color: isLight ? (accentColor === "gold" ? '#d4af37' : '#6b5b4d') : '#4FD1FF' }}
            />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
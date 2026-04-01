"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/hooks/useTheme"
import { premiumEasing, premiumStagger, premiumFadeUp, microPop } from "@/lib/animations"
import { Playfair_Display } from "next/font/google"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const playfair = Playfair_Display({ subsets: ["latin"] })

type MetaItem = {
  icon: React.ReactNode
  label: React.ReactNode
}

export type PremiumCardProps = {
  id: string
  title: string
  description?: React.ReactNode
  badgeLabel?: string

  metaItems?: MetaItem[]

  price?: React.ReactNode
  priceLabel?: string
  
  actionUrl?: string
  actionLabel?: string
  onClick?: () => void

  /**
   * For the top color bar and hover states. Defaults to "gold" (var(--fin-accent-gold)).
   * If "silver", uses var(--fin-text-secondary).
   */
  accentColor?: "gold" | "silver"
  
  /**
   * If you need an icon above the title (e.g. for past webinars)
   */
  topIcon?: React.ReactNode

  /**
   * For full-width button (like past webinars)
   */
  fullWidthButton?: boolean
}

export function PremiumCard({
  id,
  title,
  description,
  badgeLabel,
  metaItems = [],
  price,
  priceLabel,
  actionUrl = "#",
  actionLabel = "Action",
  onClick,
  accentColor = "gold",
  topIcon,
  fullWidthButton = false
}: PremiumCardProps) {
  const { isLight } = useTheme()
  const accentClass = accentColor === "gold" 
    ? "group-hover:bg-[var(--fin-accent-gold)]" 
    : "group-hover:bg-[var(--fin-text-secondary)]"
    
  const buttonHoverColors = accentColor === "gold"
    ? "hover:bg-[var(--fin-accent-gold)] hover:border-[var(--fin-accent-gold)]"
    : "hover:bg-[var(--fin-text-primary)] hover:border-[var(--fin-text-primary)]"
  
  const iconHoverColor = accentColor === "gold"
    ? "text-[var(--fin-accent-gold)]"
    : "text-[var(--fin-border-light)]"
    
  const footerBorderHover = accentColor === "gold"
    ? "group-hover:border-[var(--fin-accent-gold)]/20"
    : "group-hover:border-[var(--fin-text-secondary)]/30"

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

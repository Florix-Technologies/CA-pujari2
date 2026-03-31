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
      className="group relative flex flex-col rounded-2xl border shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(62,55,48,0.15)] overflow-hidden transition-all duration-500 will-change-transform"
      style={{
        backgroundColor: isLight ? '#FFFFFF' : '#1F3A50',
        borderColor: isLight ? 'var(--fin-border-light)' : '#4FD1FF',
        borderWidth: '1px'
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
          backgroundColor: isLight ? '#D6CCBE' : '#4FD1FF',
        }}
      />

      <div 
        className="p-8 md:p-10 flex flex-col h-full relative z-10 transition-colors duration-500 group-hover:bg-transparent"
        style={{
          backgroundColor: isLight ? '#FFFFFF' : '#1F3A50',
          color: isLight ? 'var(--fin-text-primary)' : '#E0E7FF'
        }}
      >
        
        {/* Top Icon Area */}
        {topIcon && (
          <div className="w-14 h-14 rounded-full bg-[var(--fin-bg-secondary)] flex items-center justify-center text-[var(--fin-text-secondary)] mb-6 shadow-sm border border-[var(--fin-border-light)]/50">
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
            className="inline-block px-4 py-1.5 mb-8 text-xs font-bold uppercase tracking-wider
            rounded-full bg-[var(--fin-bg-secondary)]/50 text-[var(--fin-text-primary)] w-fit border border-[var(--fin-border-light)] shadow-sm"
          >
            {badgeLabel}
          </motion.span>
        )}

        {/* TITLE */}
        <h3 className={`text-2xl md:text-3xl font-bold mb-4 text-[var(--fin-text-primary)] leading-snug ${playfair.className}`}>
          {title}
        </h3>

        {/* DESCRIPTION */}
        {description && (
          <div className="text-[var(--fin-text-secondary)] mb-8 leading-relaxed line-clamp-3 font-medium">
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
            className="space-y-4 text-sm text-[var(--fin-text-secondary)] mb-10 font-medium"
          >
            {metaItems.map((meta, i) => (
              <div key={i} className="flex items-center gap-3">
                <motion.div variants={microPop}>
                  <div className="text-[var(--fin-accent-gold)]">
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
          className={`mt-auto pt-8 border-t border-[var(--fin-border-light)] transition-colors duration-500 flex ${fullWidthButton ? 'items-center pt-6' : 'items-center justify-between'} ${footerBorderHover}`}
        >
          {price !== undefined && !fullWidthButton && (
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--fin-text-light)] mb-1 font-semibold">{priceLabel}</p>
              <motion.p variants={premiumFadeUp} className="text-2xl font-bold text-[var(--fin-text-primary)]">
                {price}
              </motion.p>
            </div>
          )}

          <Link
            href={actionUrl}
            className={`group/btn px-6 py-3 border rounded-xl font-semibold flex items-center gap-2 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-sm hover:shadow-md hover:-translate-y-1 ${buttonHoverColors} ${fullWidthButton ? 'w-full justify-center' : ''}`}
            style={{
              backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
              borderColor: isLight ? 'var(--fin-border-light)' : '#4FD1FF',
              color: isLight ? '#3E3730' : '#E0E7FF',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              if (!isLight) {
                e.currentTarget.style.color = '#FFFFFF'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLight) {
                e.currentTarget.style.color = '#E0E7FF'
              }
            }}
          >
            {actionLabel}
            <ArrowRight
              size={16}
              className={`transform group-hover/btn:translate-x-1.5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:text-white ${iconHoverColor}`}
            />
          </Link>
        </motion.div>

      </div>
    </motion.div>
  )
}

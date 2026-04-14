"use client"

import { useRef } from "react"
import { useTheme } from "@/hooks/useTheme"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { fadeUp, stagger } from "@/lib/animations"
import Link from "next/link"
import Image from "next/image"

// One master infographic per theme — resized to 2752×1310 (≈2.10:1) to match full screen
const INFOGRAPHICS = {
  light: "/bento gallery/light_infographic_2752x1310.png",
  dark: "/bento gallery/Home_Page_Illustration_Dark_2752x1310.png",
}

/**
 * 2×2 puzzle grid — premium scroll-driven animation.
 *
 * Each piece flies in from its own corner with:
 *   • Soft spring physics (slow, luxurious deceleration)
 *   • Subtle scale: 0.92 → 1 as it arrives (depth illusion)
 *   • Opacity:  0 → 1 during first half of flight (graceful appearance)
 *   • Tiny stagger so pieces arrive in a cascade, not all at once
 *
 *  ┌───────┬───────┐
 *  │  TL   │  TR   │   TL first → TR → BL → BR last
 *  ├───────┼───────┤
 *  │  BL   │  BR   │
 *  └───────┴───────┘
 */
export function BentoGallery() {
  const { isLight } = useTheme()
  const isMobile = useIsMobile()
  const containerRef = useRef<HTMLDivElement>(null)

  const currentImage = isLight ? INFOGRAPHICS.light : INFOGRAPHICS.dark

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Very soft spring — stiffness ↓, damping ↑ = longer, silkier ease-out
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 40,
    restDelta: 0.0005,
  })

  // ── Phase 1: Headline ─────────────────────────────────────
  const textOpacity = useTransform(smoothProgress, [0, 0.06, 0.20, 0.28], [0, 1, 1, 0])
  const textY       = useTransform(smoothProgress, [0, 0.06], [28, 0])
  const textScale   = useTransform(smoothProgress, [0, 0.06], [0.97, 1])

  // ── Phase 2: Pieces fly in ────────────────────────────────
  // Stagger: each piece starts 0.03 scroll units later than the previous.
  // All land at 0.72 for a final unified "snap".
  const LAND = 0.72

  // Top-Left  (starts earliest — feels like it leads the pack)
  const tlStart = 0.28
  const tlX     = useTransform(smoothProgress, [tlStart, LAND], ["-110%", "0%"])
  const tlY     = useTransform(smoothProgress, [tlStart, LAND], ["-110%", "0%"])
  const tlScale = useTransform(smoothProgress, [tlStart, LAND], [0.92,   1])
  const tlOp    = useTransform(smoothProgress, [tlStart, tlStart + 0.12, LAND], [0, 1, 1])

  // Top-Right
  const trStart = 0.31
  const trX     = useTransform(smoothProgress, [trStart, LAND], ["110%",  "0%"])
  const trY     = useTransform(smoothProgress, [trStart, LAND], ["-110%", "0%"])
  const trScale = useTransform(smoothProgress, [trStart, LAND], [0.92,    1])
  const trOp    = useTransform(smoothProgress, [trStart, trStart + 0.12, LAND], [0, 1, 1])

  // Bottom-Left
  const blStart = 0.34
  const blX     = useTransform(smoothProgress, [blStart, LAND], ["-110%", "0%"])
  const blY     = useTransform(smoothProgress, [blStart, LAND], ["110%",  "0%"])
  const blScale = useTransform(smoothProgress, [blStart, LAND], [0.92,    1])
  const blOp    = useTransform(smoothProgress, [blStart, blStart + 0.12, LAND], [0, 1, 1])

  // Bottom-Right (arrives last — completes the picture)
  const brStart = 0.37
  const brX     = useTransform(smoothProgress, [brStart, LAND], ["110%",  "0%"])
  const brY     = useTransform(smoothProgress, [brStart, LAND], ["110%",  "0%"])
  const brScale = useTransform(smoothProgress, [brStart, LAND], [0.92,    1])
  const brOp    = useTransform(smoothProgress, [brStart, brStart + 0.12, LAND], [0, 1, 1])

  /* ── MOBILE: UIverse notification-card style ── */
  if (isMobile) {
    return (
      <section
        className="py-12 px-4"
        style={{ backgroundColor: isLight ? '#F7F2E8' : '#0A1628' }}
      >
        {/* Hero notification card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mb-8"
        >
          <motion.div
            variants={fadeUp}
            className="rounded-2xl p-5 mx-auto"
            style={{
              maxWidth: 380,
              backgroundColor: isLight ? '#ffffff' : '#1E293B',
              border: `1px solid ${isLight ? 'rgba(209,175,98,0.35)' : 'rgba(79,209,255,0.2)'}`,
              boxShadow: isLight
                ? '0 4px 24px rgba(209,175,98,0.10)'
                : '0 4px 24px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header row */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full"
                style={{ backgroundColor: isLight ? '#D1AF62' : '#4FD1FF' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: isLight ? '#D1AF62' : '#4FD1FF' }}>
                  Your Trading Education Partner
                </p>
                <p className="text-base font-extrabold leading-tight" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>
                  Master The Markets
                </p>
              </div>
            </div>

            {/* Message */}
            <p className="text-sm leading-relaxed mb-5" style={{ color: isLight ? '#6B7280' : '#94A3B8' }}>
              Dive deep into technical analysis, risk management, and trading psychology. See the unseen with our advanced market charting frameworks.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Link
                href="/courses"
                className="block w-full text-center rounded-xl py-3 px-5 text-sm font-semibold text-white transition-all duration-150"
                style={{ backgroundColor: isLight ? '#D1AF62' : '#4FD1FF', color: isLight ? '#fff' : '#0A1628' }}
              >
                Start Learning
              </Link>
              <Link
                href="/courses"
                className="block w-full text-center rounded-xl py-3 px-5 text-sm font-semibold transition-all duration-150"
                style={{
                  backgroundColor: isLight ? '#F9FAFB' : 'rgba(255,255,255,0.05)',
                  color: isLight ? '#6B7280' : '#94A3B8',
                }}
              >
                View Curriculum
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Stacked Images */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="flex flex-col gap-3"
        >
          {IMAGES.map((img, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative w-full rounded-2xl overflow-hidden"
              style={{ aspectRatio: '16/9' }}
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                className="object-cover object-top"
                sizes="100vw"
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-xs font-semibold">{img.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    )
  }

  /* ── DESKTOP: Scroll-pinned bento with flying-in animations (unchanged) ── */
  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: isLight ? "#F7F2E8" : "#0F172A" }}
      >
        {/* ── Phase 1: Headline ── */}
        <motion.div
          style={{ opacity: textOpacity, y: textY, scale: textScale }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          <p className="uppercase tracking-[0.28em] text-xs font-bold text-[#D1AF62] mb-5">
            Your Trading Education Partner
          </p>
          <h2
            className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight max-w-3xl"
            style={{ color: isLight ? "#3E3730" : "#E0E7FF" }}
          >
            Master The Markets
          </h2>
          <p
            className="mt-6 max-w-lg text-base md:text-lg font-medium leading-relaxed"
            style={{ color: isLight ? "#A38970" : "#CBD5E1" }}
          >
            Dive deep into technical analysis, risk management, and trading
            psychology. See the unseen with our advanced market charting frameworks.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8 pointer-events-auto">
            <Link
              href="/courses"
              className="px-8 py-4 bg-[#D1AF62] text-white rounded-full font-bold text-base hover:bg-[#C09E51] hover:shadow-[0_0_24px_rgba(209,175,98,0.45)] transition-all duration-300 hover:scale-105"
            >
              Start Learning
            </Link>
            <Link
              href="/courses"
              className="px-8 py-4 font-bold text-base rounded-full transition-colors"
              style={{
                color: isLight ? "#3E3730" : "#E0E7FF",
                border: "1px solid",
                borderColor: isLight ? "rgba(163,137,112,0.30)" : "rgba(79,209,255,0.30)",
                backgroundColor: isLight ? "#F7F2E8" : "#1E293B",
              }}
            >
              View Curriculum
            </Link>
          </div>
        </motion.div>

        {/* ── Phase 2: 2×2 puzzle grid ── */}
        <div
          className="absolute inset-0 z-10 w-screen h-screen grid"
          style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}
        >
          {/* Top-Left */}
          <motion.div
            style={{ x: tlX, y: tlY, scale: tlScale, opacity: tlOp }}
            className="relative overflow-hidden will-change-transform"
          >
            <div className="absolute top-0 left-0 w-[200%] h-[200%]">
              <Image src={currentImage} alt="Infographic – top left" fill priority className="object-cover object-left-top" />
            </div>
          </motion.div>

          {/* Top-Right */}
          <motion.div
            style={{ x: trX, y: trY, scale: trScale, opacity: trOp }}
            className="relative overflow-hidden will-change-transform"
          >
            <div className="absolute top-0 left-[-100%] w-[200%] h-[200%]">
              <Image src={currentImage} alt="Infographic – top right" fill priority className="object-cover object-left-top" />
            </div>
          </motion.div>

          {/* Bottom-Left */}
          <motion.div
            style={{ x: blX, y: blY, scale: blScale, opacity: blOp }}
            className="relative overflow-hidden will-change-transform"
          >
            <div className="absolute top-[-100%] left-0 w-[200%] h-[200%]">
              <Image src={currentImage} alt="Infographic – bottom left" fill priority className="object-cover object-left-top" />
            </div>
          </motion.div>

          {/* Bottom-Right */}
          <motion.div
            style={{ x: brX, y: brY, scale: brScale, opacity: brOp }}
            className="relative overflow-hidden will-change-transform"
          >
            <div className="absolute top-[-100%] left-[-100%] w-[200%] h-[200%]">
              <Image src={currentImage} alt="Infographic – bottom right" fill priority className="object-cover object-left-top" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

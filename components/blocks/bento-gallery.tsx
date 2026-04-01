"use client"

import { useRef } from "react"
import { useTheme } from "@/hooks/useTheme"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"

const IMAGES = [
  {
    src: "/gallery/trading1.jpeg",
    label: "Live Market Charts",
  },
  {
    src: "/gallery/trading2.jpeg",
    label: "Technical Analysis",
  },
  {
    src: "/gallery/trading3.jpeg",
    label: "Portfolio Management",
  },
  {
    src: "/gallery/webinar.jpeg",
    label: "Risk Management",
  },
  {
    src: "/gallery/community.jpeg",
    label: "Trading Strategy",
  },
]

// Each cell slides in from a unique direction
// direction: [x%, y%] — how far off-screen it starts
const cellDirections = [
  { x: "-100%", y: "0%"   },  // large left cell  → slides from left
  { x: "100%",  y: "-100%" }, // top-right        → slides from top-right
  { x: "100%",  y: "100%"  }, // mid-right        → slides from bottom-right
  { x: "0%",    y: "100%"  }, // bottom-left      → slides from bottom
  { x: "0%",    y: "100%"  }, // bottom-right     → slides from bottom
]

export function BentoGallery() {
  const { isLight } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Phase 1 (0–0.5): headline
  const textOpacity = useTransform(scrollYProgress, [0, 0.08, 0.38, 0.50], [0, 1, 1, 0])
  const textY       = useTransform(scrollYProgress, [0, 0.08], [24, 0])

  // Phase 2 (0.5–1.0): images slide in from their directions
  // Each image: starts off-screen, arrives at 0,0 by scroll end
  const img0X = useTransform(scrollYProgress, [0.45, 0.80], ["-100%", "0%"])
  const img1X = useTransform(scrollYProgress, [0.50, 0.82], ["100%",  "0%"])
  const img1Y = useTransform(scrollYProgress, [0.50, 0.82], ["-100%", "0%"])
  const img2X = useTransform(scrollYProgress, [0.53, 0.84], ["100%",  "0%"])
  const img2Y = useTransform(scrollYProgress, [0.53, 0.84], ["100%",  "0%"])
  const img3Y = useTransform(scrollYProgress, [0.56, 0.86], ["100%",  "0%"])
  const img4Y = useTransform(scrollYProgress, [0.58, 0.88], ["100%",  "0%"])

  const img0Op = useTransform(scrollYProgress, [0.45, 0.60], [0, 1])
  const img1Op = useTransform(scrollYProgress, [0.50, 0.63], [0, 1])
  const img2Op = useTransform(scrollYProgress, [0.53, 0.66], [0, 1])
  const img3Op = useTransform(scrollYProgress, [0.56, 0.69], [0, 1])
  const img4Op = useTransform(scrollYProgress, [0.58, 0.71], [0, 1])

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      <div 
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: isLight ? '#FFFFFF' : '#0F172A' }}
      >

        {/* ── Phase 1: Headline ── */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          <p className="uppercase tracking-[0.25em] text-xs font-bold text-[#D1AF62] mb-5">
            Your Trading Education Partner
          </p>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight max-w-3xl" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>
            Master The Markets
          </h2>
          <p className="mt-6 max-w-lg text-base md:text-lg font-medium leading-relaxed" style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>
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
                color: isLight ? '#3E3730' : '#E0E7FF',
                borderWidth: '1px',
                borderColor: isLight ? '#A38970/30' : '#4FD1FF/30',
                backgroundColor: isLight ? '#F7F2E8' : '#1E293B'
              }}
            >
              View Curriculum
            </Link>
          </div>
        </motion.div>

        {/* ── Phase 2: Full-screen bento — images fly in from their own directions ── */}
        {/* Grid is always full-screen; each cell starts off-screen in its own direction */}
        <div
          className="absolute inset-0 z-10 w-full h-full
            grid gap-1 p-1
            grid-cols-8 grid-rows-[1fr_0.5fr_0.5fr_1fr]"
        >
          {/* Large left  ← from left */}
          <motion.div
            style={{ x: img0X, opacity: img0Op }}
            className="col-span-8 md:col-span-6 row-span-3 overflow-hidden rounded-xl"
          >
            <img src={IMAGES[0].src} alt={IMAGES[0].label} className="w-full h-full object-cover" />
          </motion.div>

          {/* Top-right  ↙ from top-right corner */}
          <motion.div
            style={{ x: img1X, y: img1Y, opacity: img1Op }}
            className="hidden md:block col-span-2 row-span-2 overflow-hidden rounded-xl"
          >
            <img src={IMAGES[1].src} alt={IMAGES[1].label} className="w-full h-full object-cover" />
          </motion.div>

          {/* Mid-right  ↖ from bottom-right corner */}
          <motion.div
            style={{ x: img2X, y: img2Y, opacity: img2Op }}
            className="hidden md:block col-span-2 row-span-2 overflow-hidden rounded-xl"
          >
            <img src={IMAGES[2].src} alt={IMAGES[2].label} className="w-full h-full object-cover" />
          </motion.div>

          {/* Bottom-left  ↑ from bottom */}
          <motion.div
            style={{ y: img3Y, opacity: img3Op }}
            className="col-span-4 md:col-span-3 overflow-hidden rounded-xl"
          >
            <img src={IMAGES[3].src} alt={IMAGES[3].label} className="w-full h-full object-cover" />
          </motion.div>

          {/* Bottom-right  ↑ from bottom */}
          <motion.div
            style={{ y: img4Y, opacity: img4Op }}
            className="col-span-4 md:col-span-3 overflow-hidden rounded-xl"
          >
            <img src={IMAGES[4].src} alt={IMAGES[4].label} className="w-full h-full object-cover" />
          </motion.div>
        </div>

      </div>
    </div>
  )
}

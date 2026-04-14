"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTheme } from "@/hooks/useTheme"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { Star, Users, TrendingUp } from "lucide-react"
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion"
import { fadeUp, stagger } from "@/lib/animations"
import { BentoGallery } from "@/components/blocks/bento-gallery"
import { EnhancedLoadingScreen } from "@/components/loading/enhanced-loading-screen"

const FRAME_COUNT = 100

export default function Home() {
  const words = ["Learn", "Practice", "Trade"]
  const [index, setIndex] = useState(0)
  const { isLight } = useTheme()
  const isMobile = useIsMobile()

  // Loading state - Only show loading once per session
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  // Check session storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasLoaded = sessionStorage.getItem('hasLoadedOnce')
      if (hasLoaded) {
        setIsLoading(false)
        setShowContent(true)
      }
    }
  }, [])

  // Scroll sequence state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const lightImagesRef = useRef<HTMLImageElement[]>([])
  const darkImagesRef = useRef<HTMLImageElement[]>([])
  const [isLightLoaded, setIsLightLoaded] = useState(false)
  const [isDarkLoaded, setIsDarkLoaded] = useState(false)
  const [canvasOpacity, setCanvasOpacity] = useState(0)  // For fade-in on load
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true) // For scroll hint

  // ── Mobile canvas loop animation ──
  const mobileCanvasRef = useRef<HTMLCanvasElement>(null)
  const mobileLightFramesRef = useRef<HTMLImageElement[]>([])
  const mobileDarkFramesRef = useRef<HTMLImageElement[]>([])
  const [mobileFramesLoaded, setMobileFramesLoaded] = useState(false)
  const mobileFrameIdxRef = useRef(0)

  const { scrollYProgress } = useScroll({
    target: isMobile ? undefined : heroRef,
    offset: ["start start", "end end"]
  })

  // Smooth out mouse wheel jerky scroll steps - ENHANCED FOR SMOOTHER EXPERIENCE
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,    // Reduced for even smoother motion
    damping: 25,      // Reduced for more fluid transitions
    restDelta: 0.0005 // More precise settling
  })

  const darkFrameCount = 89
  const lightFrameCount = 90

  // Track scroll progress for the progress bar & scroll indicator
  const progressBarValue = useTransform(smoothProgress, [0, 1], ["0%", "100%"])

  // Hide scroll indicator after user starts scrolling
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.02) setScrollIndicatorVisible(false)
    else setScrollIndicatorVisible(true)
  })

  // Map 0 -> 1 progress to frame index 1 -> max available for current theme
  const currentIndex = useTransform(smoothProgress, [0, 1], [1, isLight ? lightFrameCount : darkFrameCount])

  useEffect(() => {
    // 1. Text cycle
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 1800)

    // Mobile: load every 2nd frame for a looping canvas animation (~45 frames)
    if (isMobile) {
      const STEP = 2
      const loadMobileFrames = (isDarkMode: boolean) => {
        const totalFrames = isDarkMode ? 89 : 90
        const mobileFrames: HTMLImageElement[] = []
        let loadedCount = 0
        const frameIndices: number[] = []
        for (let i = 0; i < totalFrames; i += STEP) frameIndices.push(i)
        const total = frameIndices.length

        frameIndices.forEach((frameIdx, slot) => {
          const img = new Image()
          if (isDarkMode) {
            const padded = (frameIdx + 13).toString().padStart(3, '0')
            img.src = `/home_Dark/Recording_2026-04-02_024054_${padded}.png`
          } else {
            const padded = (frameIdx + 16).toString().padStart(3, '0')
            img.src = `/home_Light/Recording_2026-04-02_235740_${padded}.png`
          }
          img.onload = () => {
            mobileFrames[slot] = img
            loadedCount++
            if (loadedCount === total) {
              if (isDarkMode) {
                mobileDarkFramesRef.current = mobileFrames
              } else {
                mobileLightFramesRef.current = mobileFrames
              }
              setMobileFramesLoaded(true)
            }
          }
          img.onerror = () => { loadedCount++ }
        })
      }

      // Load both themes in parallel so switching works without delay
      loadMobileFrames(false) // dark
      loadMobileFrames(true)  // light

      return () => clearInterval(interval)
    }
    // 2. Optimized image preloading - load current theme first, then other theme
    const loadImages = (isDarkMode: boolean, priority: 'high' | 'low' = 'high') => {
      const frames = isDarkMode ? 89 : 90
      const loadedImages: HTMLImageElement[] = []
      let loadedCount = 0

      console.log(`[Hero] Starting ${priority} priority preload for ${isDarkMode ? 'DARK' : 'LIGHT'} sequence (${frames} frames)...`)

      // Batch loading with requestIdleCallback for better performance
      const loadBatch = (startIndex: number, batchSize: number) => {
        const endIndex = Math.min(startIndex + batchSize, frames)

        for (let i = startIndex; i < endIndex; i++) {
          const img = new Image()

          if (isDarkMode) {
            const darkPadded = (i + 13).toString().padStart(3, '0')
            img.src = `/home_Dark/Recording_2026-04-02_024054_${darkPadded}.png`
          } else {
            const lightPadded = (i + 16).toString().padStart(3, '0')
            img.src = `/home_Light/Recording_2026-04-02_235740_${lightPadded}.png`
          }

          // Enable faster loading
          img.loading = 'eager'
          img.decoding = 'async'

          img.onload = () => {
            loadedCount++

            // Draw first frame immediately when ready
            if (loadedCount === 1 && canvasRef.current) {
              const currentIsLight = !document.documentElement.classList.contains('dark')
              if (isDarkMode !== currentIsLight) {
                canvasRef.current.width = img.width
                canvasRef.current.height = img.height
                const ctx = canvasRef.current.getContext('2d', { alpha: false })
                if (ctx) {
                  ctx.imageSmoothingEnabled = true
                  ctx.imageSmoothingQuality = 'high'
                  ctx.drawImage(img, 0, 0)
                  setCanvasOpacity(1)
                }
              }
            }

            if (loadedCount === frames) {
              console.log(`[Hero] ✓ Finished preloading ${isDarkMode ? 'DARK' : 'LIGHT'} sequence.`)
              if (isDarkMode) {
                darkImagesRef.current = loadedImages
                setIsDarkLoaded(true)
              } else {
                lightImagesRef.current = loadedImages
                setIsLightLoaded(true)
              }
              setCanvasOpacity(1)
            }
          }

          img.onerror = () => {
            console.warn(`[Hero] Failed to load frame ${i}`)
            loadedCount++
          }

          loadedImages[i] = img
        }

        // Load next batch
        if (endIndex < frames) {
          if (priority === 'high') {
            // High priority - load immediately
            setTimeout(() => loadBatch(endIndex, batchSize), 0)
          } else {
            // Low priority - use idle callback
            if (typeof requestIdleCallback !== 'undefined') {
              requestIdleCallback(() => loadBatch(endIndex, batchSize))
            } else {
              setTimeout(() => loadBatch(endIndex, batchSize), 100)
            }
          }
        }
      }

      // Start loading in batches of 10 frames
      loadBatch(0, 10)
    }

    // Load current theme first with high priority
    const currentIsLight = !document.documentElement.classList.contains('dark')
    loadImages(!currentIsLight, 'high')

    // Load other theme with low priority after a delay
    setTimeout(() => {
      loadImages(currentIsLight, 'low')
    }, 1000)

    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  // Redraw & RAF rendering — skip entirely on mobile
  // Add redraw effect on theme change
  useEffect(() => {
    if (isMobile) return
    const imagesLoaded = isLight ? isLightLoaded : isDarkLoaded
    console.log(`[Hero] Redraw check. isLight: ${isLight}, imagesLoaded: ${imagesLoaded}`)
    
    if (!imagesLoaded || !canvasRef.current) return
    const activeImages = isLight ? lightImagesRef.current : darkImagesRef.current
    if (activeImages.length === 0) {
      console.warn(`[Hero] Active images (${isLight ? 'LIGHT' : 'DARK'}) not yet available.`)
      return
    }

    const latestVal = currentIndex.get()
    const frameNumber = Math.min(activeImages.length - 1, Math.max(0, Math.floor(latestVal) - 1))
    const img = activeImages[frameNumber]
    
    console.log(`[Hero] Redrawing frame ${frameNumber} for ${isLight ? 'LIGHT' : 'DARK'} mode.`)
    if (img) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        // Ensure width/height are set if they haven't been
        if (canvasRef.current.width !== img.width) canvasRef.current.width = img.width
        if (canvasRef.current.height !== img.height) canvasRef.current.height = img.height
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        ctx.drawImage(img, 0, 0)
      }
    }
  }, [isLight, isLightLoaded, isDarkLoaded, isMobile])

  // ── Mobile: auto-loop canvas animation (RAF + ResizeObserver) ──
  useEffect(() => {
    if (!isMobile || !mobileFramesLoaded) return
    const canvas = mobileCanvasRef.current
    if (!canvas) return

    mobileFrameIdxRef.current = 0

    // Keep canvas pixel dimensions synced to its CSS layout size
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w
        canvas.height = h
      }
    }
    resizeCanvas()
    const ro = new ResizeObserver(resizeCanvas)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    // Cross-dissolve: each frame holds for HOLD_MS then fades into
    // the next over FADE_MS — silky smooth even at low frame rates
    const HOLD_MS  = 600   // how long each frame is fully visible
    const FADE_MS  = 280   // cross-fade overlap duration
    const CYCLE_MS = HOLD_MS + FADE_MS

    let cycleStart = 0
    let curIdx = 0
    let rafId: number

    const drawImg = (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      alpha: number
    ) => {
      if (!img?.complete) return
      const sx = canvas.width  / img.naturalWidth
      const sy = canvas.height / img.naturalHeight
      const s  = Math.min(sx, sy)
      const dw = img.naturalWidth  * s
      const dh = img.naturalHeight * s
      const ox = (canvas.width  - dw) / 2
      const oy = (canvas.height - dh) / 2
      ctx.globalAlpha = alpha
      ctx.drawImage(img, ox, oy, dw, dh)
    }

    const tick = (timestamp: number) => {
      rafId = requestAnimationFrame(tick)
      if (cycleStart === 0) cycleStart = timestamp

      const frames = isLight ? mobileLightFramesRef.current : mobileDarkFramesRef.current
      if (!frames || frames.length === 0 || canvas.width === 0) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const elapsed = timestamp - cycleStart

      // Advance to next frame when cycle completes
      if (elapsed >= CYCLE_MS) {
        curIdx = (curIdx + 1) % frames.length
        cycleStart = timestamp
      }

      const nextIdx = (curIdx + 1) % frames.length
      // easeInOutSine for a gentle fade curve
      const t = Math.max(0, Math.min(1, (elapsed - HOLD_MS) / FADE_MS))
      const fadeProgress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, canvas.width, canvas.height)
      ctx.clip()

      drawImg(ctx, frames[curIdx],    1 - fadeProgress)
      if (fadeProgress > 0) drawImg(ctx, frames[nextIdx], fadeProgress)

      ctx.globalAlpha = 1
      ctx.restore()
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [isMobile, mobileFramesLoaded, isLight])

  // Optimized canvas rendering with RAF
  const renderFrameRef = useRef<number | null>(null)
  const lastFrameRef = useRef<number>(-1)

  useMotionValueEvent(currentIndex, "change", (latest) => {
    if (isMobile) return
    const imagesLoaded = isLight ? isLightLoaded : isDarkLoaded
    if (!imagesLoaded || !canvasRef.current) return

    const activeImages = isLight ? lightImagesRef.current : darkImagesRef.current
    if (activeImages.length === 0) return

    const frameNumber = Math.min(activeImages.length - 1, Math.max(0, Math.floor(latest) - 1))

    // Skip if same frame
    if (frameNumber === lastFrameRef.current) return
    lastFrameRef.current = frameNumber

    const img = activeImages[frameNumber]

    if (img && img.complete) {
      // Cancel previous RAF if exists
      if (renderFrameRef.current !== null) {
        cancelAnimationFrame(renderFrameRef.current)
      }

      // Use RAF for smooth rendering
      renderFrameRef.current = requestAnimationFrame(() => {
        if (!canvasRef.current) return
        const ctx = canvasRef.current.getContext('2d', { alpha: false, desynchronized: true })
        if (ctx) {
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
        }
        renderFrameRef.current = null
      })
    }
  })

  const handleLoadingComplete = () => {
    // Mark as loaded in sessionStorage (will persist for the session only)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasLoadedOnce', 'true')
    }
    setIsLoading(false)
    // Add a small delay for smooth transition
    setTimeout(() => {
      setShowContent(true)
    }, 100)
  }

  return (
    <>
      {/* Enhanced Loading Screen with Video */}
      {isLoading && <EnhancedLoadingScreen isLight={isLight} onComplete={handleLoadingComplete} />}

      {/* Main Content - Only show after loading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Navigation />

      {/* HERO — MOBILE: Video + Info Cards | DESKTOP: Scroll-frame Animation */}
      {isMobile ? (
        /* ── MOBILE HERO: Looping canvas animation + info cards ── */
        <section className="overflow-hidden w-full" style={{ backgroundColor: isLight ? '#F7F2E8' : '#0F172A', paddingTop: '80px' }}>

          {/* Canvas: 16:9 container, strictly contained */}
          <div className="relative overflow-hidden" style={{ width: '100%', aspectRatio: '16/9', maxWidth: '100vw' }}>
            {/* Shimmer shown while frames load */}
            {!mobileFramesLoaded && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: isLight
                    ? 'linear-gradient(110deg,#F7F2E8 30%,#EDE5D0 50%,#F7F2E8 70%)'
                    : 'linear-gradient(110deg,#0F172A 30%,#1E293B 50%,#0F172A 70%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.8s infinite linear',
                }}
              />
            )}
            <canvas
              ref={mobileCanvasRef}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                opacity: mobileFramesLoaded ? 1 : 0,
                transition: 'opacity 0.6s ease',
              }}
            />
          </div>

          {/* Info section */}
          <div
            className="px-4 pt-6 pb-8"
            style={{ backgroundColor: isLight ? '#FFFFFF' : '#0F172A' }}
          >
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-5 text-center"
            >
              <h1
                className="text-2xl font-extrabold mb-2 tracking-tight leading-snug"
                style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}
              >
                Learn, Practice &amp; Trade
              </h1>
              <p className="text-sm" style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>
                India's trusted stock market education platform
              </p>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex gap-3"
            >
              <Link
                href="/courses"
                className="flex-1 text-center py-3 rounded-full font-bold text-sm text-white transition-colors"
                style={{ backgroundColor: isLight ? '#D1AF62' : '#3B82F6' }}
              >
                Explore Courses
              </Link>
              <Link
                href="/webinar"
                className="flex-1 text-center py-3 rounded-full border font-bold text-sm transition-colors"
                style={{
                  borderColor: isLight ? 'rgba(163,137,112,0.35)' : 'rgba(79,209,255,0.35)',
                  color: isLight ? '#3E3730' : '#E0E7FF',
                }}
              >
                Free Webinar
              </Link>
            </motion.div>
          </div>
        </section>
      ) : (
        /* ── DESKTOP HERO: Scroll-frame Animation (unchanged) ── */
        <section ref={heroRef} className={`hidden md:block relative h-[350vh] ${isLight ? "bg-[#F7F2E8]" : "bg-[#0F172A]"} theme-transition`}>
          <div className="sticky top-0 h-[100svh] overflow-hidden flex items-center justify-center smooth-transform">

            {/* Shimmer Placeholder — visible while images load */}
            {!isLightLoaded && !isDarkLoaded && (
              <div
                className="absolute inset-0 z-10"
                style={{
                  backgroundImage: isLight
                    ? 'linear-gradient(110deg, #F7F2E8 30%, #EDE5D0 50%, #F7F2E8 70%)'
                    : 'linear-gradient(110deg, #0F172A 30%, #1E293B 50%, #0F172A 70%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.8s infinite linear',
                }}
              />
            )}

            {/* Canvas — fades in when loaded */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full smooth-transform"
              style={{
                willChange: "transform, opacity",
                objectFit: "cover",
                objectPosition: "center",
                opacity: canvasOpacity,
                transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                imageRendering: "crisp-edges",
              }}
            />

            {/* Scroll Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] z-20" style={{ backgroundColor: isLight ? 'rgba(163,137,112,0.15)' : 'rgba(79,209,255,0.15)' }}>
              <motion.div
                className="h-full origin-left"
                style={{
                  width: progressBarValue,
                  background: isLight
                    ? 'linear-gradient(90deg, #D1AF62, #A38970)'
                    : 'linear-gradient(90deg, #4FD1FF, #818CF8)',
                  boxShadow: isLight ? '0 0 8px rgba(209,175,98,0.6)' : '0 0 8px rgba(79,209,255,0.6)',
                }}
              />
            </div>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
              animate={{ opacity: scrollIndicatorVisible ? 1 : 0, y: scrollIndicatorVisible ? 0 : 10 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.15em] md:tracking-[0.2em] uppercase" style={{ color: isLight ? '#A38970' : '#4FD1FF' }}>Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                style={{ color: isLight ? '#D1AF62' : '#4FD1FF' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-5 md:h-5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </motion.div>
            </motion.div>

          </div>
        </section>
      )}

      {/* Shimmer + marquee keyframe animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-track {
          width: max-content;
          animation: marquee-left 28s linear infinite;
        }
        .marquee-track-reverse {
          width: max-content;
          animation: marquee-right 28s linear infinite;
        }
        .marquee-track:hover,
        .marquee-track-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* BENTO SCROLL GALLERY */}
      <BentoGallery />

      {/* TRUST SIGNALS */}
      <section
        className={`py-14 md:py-24 relative overflow-hidden ${isLight ? "border-t border-[#A38970]/15" : "border-t border-[#4FD1FF]/15"}`}
        style={{ backgroundColor: isLight ? '#F7F4EE' : '#0A1628' }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          {[
            {
              icon: Users,
              stat: "5,000+",
              label: "Students Trained",
              desc: "Beginners to advanced traders mentored across India — each one guided with structure and clarity.",
              primaryHref: "/courses",
              primaryLabel: "Join Now",
              secondaryLabel: "Meet the Community",
              iconBg: isLight ? '#D1AF62' : '#4FD1FF',
              iconColor: isLight ? '#fff' : '#0A1628',
            },
            {
              icon: TrendingUp,
              stat: "15+ Yrs",
              label: "Market Experience",
              desc: "Deep expertise across equities, options & futures — built through real markets, not just theory.",
              primaryHref: "/about",
              primaryLabel: "About Shobha",
              secondaryLabel: "View Credentials",
              iconBg: isLight ? '#D1AF62' : '#4FD1FF',
              iconColor: isLight ? '#fff' : '#0A1628',
            },
            {
              icon: Star,
              stat: "4.9 / 5",
              label: "Avg Student Rating",
              desc: "Consistently top-rated across all batches. Real results from real students — no hype.",
              primaryHref: "/courses",
              primaryLabel: "Read Reviews",
              secondaryLabel: "Explore Courses",
              iconBg: isLight ? '#D1AF62' : '#4FD1FF',
              iconColor: isLight ? '#fff' : '#0A1628',
            },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 340, damping: 24 }}
                className="rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-200"
                style={{
                  backgroundColor: isLight ? '#ffffff' : '#1E293B',
                  border: `1px solid ${isLight ? 'rgba(209,175,98,0.3)' : 'rgba(79,209,255,0.15)'}`,
                  boxShadow: isLight ? '0 4px 20px rgba(209,175,98,0.08)' : '0 4px 20px rgba(0,0,0,0.25)',
                }}
              >
                {/* Header: icon circle + label + stat */}
                <div className="flex items-center gap-3">
                  <span
                    className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <Icon size={15} style={{ color: item.iconColor }} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: isLight ? '#A38970' : '#94A3B8' }}>
                      {item.label}
                    </p>
                    <p className="text-lg font-extrabold leading-tight" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>
                      {item.stat}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <p className="text-sm leading-relaxed" style={{ color: isLight ? '#6B7280' : '#94A3B8' }}>
                  {item.desc}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                  <Link
                    href={item.primaryHref}
                    className="block w-full text-center rounded-xl py-2.5 text-sm font-semibold transition-all duration-150"
                    style={{ backgroundColor: item.iconBg, color: item.iconColor }}
                  >
                    {item.primaryLabel}
                  </Link>
                  <Link
                    href={item.primaryHref}
                    className="block w-full text-center rounded-xl py-2.5 text-sm font-semibold transition-all duration-150"
                    style={{
                      backgroundColor: item.secondaryLabel === 'Explore Courses' ? (isLight ? '#D1AF62' : '#3B82F6') : isLight ? '#F9FAFB' : 'rgba(255,255,255,0.05)',
                      color: item.secondaryLabel === 'Explore Courses' ? '#fff' : isLight ? '#6B7280' : '#94A3B8',
                    }}
                  >
                    {item.secondaryLabel}
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* TESTIMONIALS — SOCIAL PROOF */}
      <section
        className="py-16 md:py-24 lg:py-32 relative"
        style={{
          backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
          color: isLight ? '#3E3730' : '#E0E7FF',
          borderTop: `1px solid ${isLight ? 'rgba(163,137,112,0.1)' : 'rgba(79,209,255,0.2)'}`
        }}
      >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight 
            ? 'radial-gradient(circle at center, rgba(209,175,98,0.1), transparent 70%)'
            : 'radial-gradient(circle at center, rgba(79,209,255,0.1), transparent 70%)'
        }}
      />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative z-10 max-w-7xl mx-auto px-4 md:px-6"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 md:mb-6 tracking-tight drop-shadow-sm"
            style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}
          >
            Learners, Not Just Students
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-center mb-12 md:mb-16 lg:mb-20 max-w-2xl mx-auto text-base md:text-lg"
            style={{ color: isLight ? '#A38970' : '#CBD5E1' }}
          >
            Real people. Real progress. Real confidence. Read what our community has to say.
          </motion.p>

          {/* ── MOBILE: infinite marquee scroll ── */}
          {(() => {
            const testimonials = [
              { name: "Rajesh Kumar", role: "Investment Professional", text: "Clear frameworks and honest teaching. This changed how I see markets entirely.", initials: "RK" },
              { name: "Priya Sharma", role: "Beginner Trader", text: "No fear anymore. I finally understand what I'm doing and approach the market calmly.", initials: "PS" },
              { name: "Amit Patel", role: "Business Owner", text: "Structured, practical, and grounded in reality. The best educational investment I've made.", initials: "AP" },
              { name: "Sneha Reddy", role: "Options Trader", text: "The options strategies taught here are pure gold! I'm now consistently profitable with my Nifty trades.", initials: "SR" },
              { name: "Vikram Singh", role: "IT Professional", text: "From complete beginner to confident trader in 6 months. The mentorship made all the difference!", initials: "VS" },
              { name: "Ananya Desai", role: "Financial Analyst", text: "Finally a course that focuses on risk management first. My portfolio has never been more stable.", initials: "AD" },
            ]
            const TestiCard = ({ t, i }: { t: typeof testimonials[0]; i: number }) => (
              <div
                key={i}
                className="flex-shrink-0 w-72 rounded-2xl border p-5 flex flex-col justify-between"
                style={{
                  backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
                  borderColor: isLight ? 'rgba(163,137,112,0.2)' : 'rgba(79,209,255,0.3)',
                }}
              >
                <div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-[#D1AF62] text-[#D1AF62]" />)}
                  </div>
                  <p className="text-sm leading-relaxed italic mb-4" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t pt-3" style={{ borderColor: isLight ? 'rgba(163,137,112,0.15)' : 'rgba(79,209,255,0.2)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: isLight ? 'rgba(209,175,98,0.12)' : 'rgba(79,209,255,0.12)', color: isLight ? '#D1AF62' : '#4FD1FF', border: `1px solid ${isLight ? 'rgba(209,175,98,0.3)' : 'rgba(79,209,255,0.3)'}` }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>{t.name}</p>
                    <p className="text-[10px]" style={{ color: isLight ? '#A38970' : '#94A3B8' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            )
            return (
              <>
                {/* Mobile marquee */}
                <div className="md:hidden overflow-hidden -mx-4">
                  {/* Row 1 — scrolls left */}
                  <div className="flex gap-4 px-4 mb-4 marquee-track">
                    {[...testimonials, ...testimonials].map((t, i) => <TestiCard key={i} t={t} i={i} />)}
                  </div>
                  {/* Row 2 — scrolls right (reverse) */}
                  <div className="flex gap-4 px-4 marquee-track-reverse">
                    {[...testimonials, ...testimonials].map((t, i) => <TestiCard key={i} t={t} i={i} />)}
                  </div>
                </div>

                {/* Desktop grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {testimonials.map((t, i) => (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      className="rounded-3xl border p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between"
                      style={{ backgroundColor: isLight ? '#FFFFFF' : '#1E293B', borderColor: isLight ? 'rgba(163,137,112,0.2)' : 'rgba(79,209,255,0.3)', color: isLight ? '#3E3730' : '#E0E7FF' }}
                    >
                      <div>
                        <div className="flex gap-1 mb-6">
                          {[...Array(5)].map((_, j) => <Star key={j} size={18} className="fill-[#D1AF62] text-[#D1AF62]" />)}
                        </div>
                        <p className="mb-8 lg:mb-10 leading-relaxed text-lg italic font-medium" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>
                          &ldquo;{t.text}&rdquo;
                        </p>
                      </div>
                      <div className="flex items-center gap-4 border-t pt-6" style={{ borderColor: isLight ? 'rgba(163,137,112,0.2)' : 'rgba(79,209,255,0.3)' }}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-inner" style={{ backgroundColor: isLight ? 'rgba(209,175,98,0.1)' : 'rgba(79,209,255,0.1)', color: isLight ? '#D1AF62' : '#4FD1FF', border: `1px solid ${isLight ? 'rgba(209,175,98,0.3)' : 'rgba(79,209,255,0.3)'}` }}>
                          {t.initials}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>{t.name}</p>
                          <p className="text-sm" style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>{t.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )
          })()}
        </motion.div>
      </section>

      {/* CTA — PERSONAL INVITE */}
      <section
        className="py-16 md:py-32 lg:py-48 relative overflow-hidden"
        style={{
          backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
          borderTop: `1px solid ${isLight ? 'rgba(163,137,112,0.2)' : 'rgba(79,209,255,0.2)'}`
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isLight 
              ? 'radial-gradient(circle at bottom, rgba(188,114,96,0.06), transparent 60%)'
              : 'radial-gradient(circle at bottom, rgba(79,209,255,0.08), transparent 60%)'
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 md:mb-8 tracking-tight drop-shadow-sm" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>
            Start Your Trading Journey the Right Way
          </h2>
          <p className="text-base md:text-lg lg:text-xl mb-8 md:mb-10 lg:mb-12 max-w-2xl mx-auto" style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>
            Learn with structure, discipline, and clarity &mdash; not shortcuts.
          </p>

          <Link
            href="/courses"
            className="inline-block px-8 md:px-10 lg:px-12 py-4 md:py-5 text-white rounded-full font-bold text-base md:text-lg transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: isLight ? '#D1AF62' : '#3B82F6',
              boxShadow: isLight ? '0 0 0 rgba(209,175,98,0)' : '0 0 0 rgba(59,130,246,0)',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = isLight ? '#C09E51' : '#2563EB')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = isLight ? '#D1AF62' : '#3B82F6')}
          >
            Explore Courses
          </Link>
        </motion.div>
      </section>

        <Footer />
      </motion.div>
    </>
  )
}

"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTheme } from "@/hooks/useTheme"
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

  const { scrollYProgress } = useScroll({
    target: heroRef,
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Add redraw effect on theme change
  useEffect(() => {
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
  }, [isLight, isLightLoaded, isDarkLoaded])

  // Optimized canvas rendering with RAF
  const renderFrameRef = useRef<number | null>(null)
  const lastFrameRef = useRef<number>(-1)

  useMotionValueEvent(currentIndex, "change", (latest) => {
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

      {/* HERO — SEQUENCE ANIMATION */}
      <section ref={heroRef} className={`relative h-[350vh] ${isLight ? "bg-[#F7F2E8]" : "bg-[#0F172A]"} theme-transition`}>
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

      {/* Shimmer keyframe animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* BENTO SCROLL GALLERY */}
      <BentoGallery />

      {/* TRUST SIGNALS */}
      <section
        className={`py-16 md:py-32 lg:py-48 relative overflow-hidden ${isLight ? "border-t border-[#A38970]/20" : "border-t border-[#4FD1FF]/20"}`}
        style={{
          backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
          color: isLight ? '#3E3730' : '#E0E7FF'
        }}
      >
        <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight 
            ? 'radial-gradient(ellipse at top, rgba(209,175,98,0.05), transparent 50%)'
            : 'radial-gradient(ellipse at top, rgba(79,209,255,0.05), transparent 50%)'
        }}
      />
        <motion.div
           variants={stagger}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
        >
          {[
            { icon: Users, stat: "5000+", label: "Students Trained" },
            { icon: TrendingUp, stat: "15+", label: "Years Experience" },
            { icon: Star, stat: "4.9/5", label: "Avg Student Rating" },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ scale: 1.02, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative rounded-2xl md:rounded-[1.5rem] border p-6 md:p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(209,175,98,0.15)] transition-all duration-500 overflow-hidden"
                style={{
                  backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
                  borderColor: isLight ? '#A38970/10' : '#4FD1FF/30'
                }}
              >
                {/* Sexy Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#F7F2E8] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Animated Icon Badge */}
                <motion.div
                  className="relative mx-auto mb-6 w-16 h-16 rounded-2xl shadow-sm border flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(209,175,98,0.2)] transition-all duration-500"
                  style={{
                    backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
                    borderColor: isLight ? '#A38970/10' : '#4FD1FF/20'
                  }}
                  whileHover={{ rotate: [0, -10, 10, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Icon className="text-[#D1AF62] group-hover:scale-110 transition-transform duration-500" size={28} />
                </motion.div>

                {/* Typography */}
                <div className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 tracking-tighter drop-shadow-sm group-hover:transition-colors duration-500" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>
                  {item.stat}
                </div>
                <div className="relative z-10 font-bold text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em] group-hover:transition-colors duration-500" style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>
                  {item.label}
                </div>
                
                {/* Animated Bottom Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-[#D1AF62] group-hover:w-full transition-all duration-500 ease-out" />
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
          borderTop: `1px solid ${isLight ? '#A38970/10' : '#4FD1FF/20'}`
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Rajesh Kumar",
                role: "Investment Professional",
                text: "Clear frameworks and honest teaching. This changed how I see markets entirely.",
                initials: "RK",
              },
              {
                name: "Priya Sharma",
                role: "Beginner Trader",
                text: "No fear anymore. I finally understand what I'm doing and approach the market calmly.",
                initials: "PS",
              },
              {
                name: "Amit Patel",
                role: "Business Owner",
                text: "Structured, practical, and grounded in reality. The best educational investment I've made.",
                initials: "AP",
              },
              {
                name: "Sneha Reddy",
                role: "Options Trader",
                text: "The options strategies taught here are pure gold! I'm now consistently profitable with my Nifty trades.",
                initials: "SR",
              },
              {
                name: "Vikram Singh",
                role: "IT Professional",
                text: "From complete beginner to confident trader in 6 months. The mentorship made all the difference!",
                initials: "VS",
              },
              {
                name: "Ananya Desai",
                role: "Financial Analyst",
                text: "Finally a course that focuses on risk management first. My portfolio has never been more stable.",
                initials: "AD",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-2xl md:rounded-3xl border p-6 md:p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between"
                style={{
                  backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
                  borderColor: isLight ? '#A38970/20' : '#4FD1FF/30',
                  color: isLight ? '#3E3730' : '#E0E7FF'
                }}
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} className="fill-[#D1AF62] text-[#D1AF62]" />
                    ))}
                  </div>

                  <p className="mb-6 md:mb-8 lg:mb-10 leading-relaxed text-base md:text-lg italic font-medium" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t pt-6" style={{ borderColor: isLight ? '#A38970/20' : '#4FD1FF/30' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-inner" style={{ backgroundColor: isLight ? '#D1AF62/10' : '#4FD1FF/10', color: isLight ? '#D1AF62' : '#4FD1FF', border: `1px solid ${isLight ? '#D1AF62/30' : '#4FD1FF/30'}` }}>
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
        </motion.div>
      </section>

      {/* CTA — PERSONAL INVITE */}
      <section
        className="py-16 md:py-32 lg:py-48 relative overflow-hidden"
        style={{
          backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
          borderTop: `1px solid ${isLight ? '#A38970/20' : '#4FD1FF/20'}`
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
            className="inline-block px-8 md:px-10 lg:px-12 py-4 md:py-5 bg-[#D1AF62] text-white rounded-full font-bold text-base md:text-lg hover:shadow-[0_0_30px_rgba(209,175,98,0.4)] hover:bg-[#C09E51] transition-all duration-300 hover:scale-105"
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

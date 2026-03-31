"use client"

import { useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Star, Users, TrendingUp } from "lucide-react"
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion"
import { fadeUp, stagger } from "@/lib/animations"
import { BentoGallery } from "@/components/blocks/bento-gallery"

const FRAME_COUNT = 100

export default function Home() {
  const words = ["Learn", "Practice", "Trade"]
  const [index, setIndex] = useState(0)

  // Scroll sequence state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const [imagesLoaded, setImagesLoaded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  })

  // Smooth out mouse wheel jerky scroll steps
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001
  })

  // Map 0 -> 1 progress to frame index 1 -> FRAME_COUNT
  const currentIndex = useTransform(smoothProgress, [0, 1], [1, FRAME_COUNT])

  useEffect(() => {
    // 1. Text cycle
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 1800)

    // 2. Preload images
    const loadImages = () => {
      const loadedImages: HTMLImageElement[] = []
      let loadedCount = 0

      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image()
        const paddedIndex = i.toString().padStart(3, '0')
        img.src = `/frame/ezgif-frame-${paddedIndex}.png`
        
        img.onload = () => {
          // Tell browser to decode it off main thread immediately
          if (img.decode) {
             img.decode().catch(() => {})
          }
          loadedCount++
          if (loadedCount === FRAME_COUNT) {
            setImagesLoaded(true)
            // Draw first frame
            if (canvasRef.current && loadedImages[0]) {
              canvasRef.current.width = loadedImages[0].width
              canvasRef.current.height = loadedImages[0].height
              const ctx = canvasRef.current.getContext('2d')
              if (ctx) ctx.drawImage(loadedImages[0], 0, 0)
            }
          }
        }
        loadedImages.push(img)
      }
      imagesRef.current = loadedImages
    }
    loadImages()

    return () => clearInterval(interval)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useMotionValueEvent(currentIndex, "change", (latest) => {
    if (!imagesLoaded || !canvasRef.current || imagesRef.current.length === 0) return
    const frameNumber = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(latest) - 1))
    const img = imagesRef.current[frameNumber]
    if (img) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  })

  return (
    <>
      <Navigation />

      {/* HERO — SEQUENCE ANIMATION */}
      <section ref={heroRef} className="relative h-[300vh] bg-[#F7F2E8]">
        <div className="sticky top-0 h-[100vh] overflow-hidden flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Just the canvas, no text overlay as requested */}
        </div>
      </section>

      {/* BENTO SCROLL GALLERY */}
      <BentoGallery />

      {/* TRUST SIGNALS */}
      <section className="py-48 bg-white text-[#3E3730] relative overflow-hidden border-t border-[#A38970]/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(209,175,98,0.05),transparent_50%)] pointer-events-none" />
        <motion.div
           variants={stagger}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 md:gap-10"
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
                className="group relative rounded-[1.5rem] bg-white border border-[#A38970]/10 p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(209,175,98,0.15)] transition-all duration-500 overflow-hidden"
              >
                {/* Sexy Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#F7F2E8] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Animated Icon Badge */}
                <motion.div
                  className="relative mx-auto mb-6 w-16 h-16 rounded-2xl bg-white shadow-sm border border-[#A38970]/10 flex items-center justify-center group-hover:border-[#D1AF62]/30 group-hover:shadow-[0_0_20px_rgba(209,175,98,0.2)] transition-all duration-500"
                  whileHover={{ rotate: [0, -10, 10, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Icon className="text-[#D1AF62] group-hover:scale-110 transition-transform duration-500" size={28} />
                </motion.div>

                {/* Typography */}
                <div className="relative z-10 text-5xl font-extrabold text-[#3E3730] mb-2 tracking-tighter drop-shadow-sm group-hover:text-[#D1AF62] transition-colors duration-500">
                  {item.stat}
                </div>
                <div className="relative z-10 text-[#A38970] font-bold text-xs uppercase tracking-[0.2em] group-hover:text-[#3E3730] transition-colors duration-500">
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
      <section className="py-32 bg-white text-[#3E3730] relative border-t border-[#A38970]/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(209,175,98,0.1),transparent_70%)] pointer-events-none" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative z-10 max-w-7xl mx-auto px-6"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold text-center mb-6 tracking-tight drop-shadow-sm text-[#3E3730]"
          >
            Learners, Not Just Students
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-center text-[#A38970] mb-20 max-w-2xl mx-auto text-lg"
          >
            Real people. Real progress. Real confidence. Read what our community has to say.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
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
                text: "No fear anymore. I finally understand what I’m doing and approach the market calmly.",
                initials: "PS",
              },
              {
                name: "Amit Patel",
                role: "Business Owner",
                text: "Structured, practical, and grounded in reality. The best educational investment I've made.",
                initials: "AP",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-3xl bg-white border border-[#A38970]/20 p-10 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} className="fill-[#D1AF62] text-[#D1AF62]" />
                    ))}
                  </div>

                  <p className="text-[#3E3730] mb-10 leading-relaxed text-lg italic font-medium">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-[#A38970]/20 pt-6">
                  <div className="w-12 h-12 rounded-full bg-[#D1AF62]/10 text-[#D1AF62] flex items-center justify-center font-bold border border-[#D1AF62]/30 shadow-inner">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-[#3E3730]">{t.name}</p>
                    <p className="text-sm text-[#A38970]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA — PERSONAL INVITE */}
      <section className="py-48 bg-white text-[#3E3730] relative border-t border-[#A38970]/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(188,114,96,0.06),transparent_60%)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-5xl font-extrabold mb-8 tracking-tight drop-shadow-sm text-[#3E3730]">
            Start Your Trading Journey the Right Way
          </h2>
          <p className="text-xl text-[#A38970] mb-12 max-w-2xl mx-auto">
            Learn with structure, discipline, and clarity &mdash; not shortcuts.
          </p>

          <Link
            href="/courses"
            className="inline-block px-12 py-5 bg-[#D1AF62] text-white
            rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(209,175,98,0.4)]
            hover:bg-[#C09E51] transition-all duration-300 hover:scale-105"
          >
            Explore Courses
          </Link>
        </motion.div>
      </section>

      <Footer />
    </>
  )
}

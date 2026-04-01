"use client"

import { useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { useTheme } from "@/hooks/useTheme"
import { motion } from "framer-motion"
import {
  TrendingUp, CandlestickChart, Briefcase,
  IndianRupee, Lightbulb, BarChart2,
} from "lucide-react"

type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }

export default function CoursesPage() {
  const { isLight } = useTheme()
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const animRef    = useRef<number>(0)
  const modeRef    = useRef(isLight)

  // Keep modeRef in sync without restarting the loop
  useEffect(() => { modeRef.current = isLight }, [isLight])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Particles orbiting the sphere
    const particles: Particle[] = Array.from({ length: 70 }, () => {
      const angle = Math.random() * Math.PI * 2
      const dist  = 0 // set in loop relative to radius
      return {
        x: Math.cos(angle) * (150 + Math.random() * 100),
        y: Math.sin(angle) * (150 + Math.random() * 100),
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25 - 0.08,
        life:    Math.floor(Math.random() * 200),
        maxLife: 140 + Math.random() * 120,
        size:    0.4 + Math.random() * 1.6,
      }
    })

    let frame = 0

    const draw = () => {
      frame++
      const light  = modeRef.current
      const W      = canvas.width
      const H      = canvas.height
      const cx     = W / 2
      // sphere sits in upper area — center at ~36% height
      const cy     = H * 0.36
      const radius = Math.min(W, H) * 0.19

      ctx.clearRect(0, 0, W, H)

      // ── Background ──
      ctx.fillStyle = light ? "#F5EDD8" : "#03050D"
      ctx.fillRect(0, 0, W, H)

      // ── Outer bloom (slow pulse) ──
      const bloomR = radius * 2.9
      const bloom  = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomR)
      const bp     = 0.22 + 0.07 * Math.sin(frame * 0.018)
      if (light) {
        bloom.addColorStop(0,   `rgba(230,160,40,${bp})`)
        bloom.addColorStop(0.45, `rgba(200,100,20,${bp * 0.45})`)
        bloom.addColorStop(1,    "rgba(0,0,0,0)")
      } else {
        bloom.addColorStop(0,   `rgba(50,85,240,${bp})`)
        bloom.addColorStop(0.45, `rgba(30,55,180,${bp * 0.45})`)
        bloom.addColorStop(1,    "rgba(0,0,0,0)")
      }
      ctx.beginPath()
      ctx.arc(cx, cy, bloomR, 0, Math.PI * 2)
      ctx.fillStyle = bloom
      ctx.fill()

      // ── Inner atmosphere (mid glow) ──
      const atmR  = radius * 1.6
      const atm   = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, atmR)
      const ap    = 0.15 + 0.05 * Math.sin(frame * 0.025 + 1)
      if (light) {
        atm.addColorStop(0,  `rgba(255,200,60,${ap})`)
        atm.addColorStop(1,   "rgba(0,0,0,0)")
      } else {
        atm.addColorStop(0,  `rgba(80,120,255,${ap})`)
        atm.addColorStop(1,   "rgba(0,0,0,0)")
      }
      ctx.beginPath()
      ctx.arc(cx, cy, atmR, 0, Math.PI * 2)
      ctx.fillStyle = atm
      ctx.fill()

      // ── Sphere base ──
      const sg = ctx.createRadialGradient(
        cx - radius * 0.28, cy - radius * 0.28, radius * 0.05,
        cx, cy, radius
      )
      if (light) {
        sg.addColorStop(0,   "#FFD060")
        sg.addColorStop(0.35, "#E89020")
        sg.addColorStop(0.75, "#B05010")
        sg.addColorStop(1,    "#6A2804")
      } else {
        sg.addColorStop(0,   "#1e2a50")
        sg.addColorStop(0.4,  "#0d1838")
        sg.addColorStop(0.8,  "#060d22")
        sg.addColorStop(1,    "#03050D")
      }
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fillStyle = sg
      ctx.fill()

      // ── Clip for surface details ──
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.clip()

      // Rotating dark patches (simulate slow rotation)
      const rot = frame * 0.004
      for (let i = 0; i < 5; i++) {
        const a  = rot + (i * Math.PI * 2) / 5
        const bx = cx + Math.cos(a) * radius * 0.38
        const by = cy + Math.sin(a) * radius * 0.28
        const bg = ctx.createRadialGradient(bx, by, 0, bx, by, radius * 0.38)
        if (light) {
          bg.addColorStop(0, `rgba(160,70,5,${0.35 + 0.12 * Math.sin(frame * 0.012 + i)})`)
          bg.addColorStop(1,  "rgba(0,0,0,0)")
        } else {
          bg.addColorStop(0, `rgba(5,10,35,${0.55 + 0.15 * Math.sin(frame * 0.012 + i)})`)
          bg.addColorStop(1,  "rgba(0,0,0,0)")
        }
        ctx.beginPath()
        ctx.arc(bx, by, radius * 0.38, 0, Math.PI * 2)
        ctx.fillStyle = bg
        ctx.fill()
      }

      // Animated shimmer waves
      const wt = frame * 0.016
      for (let i = 0; i < 4; i++) {
        const wx = cx + Math.sin(wt + i * 1.7) * radius * 0.55
        const wy = cy + Math.cos(wt * 0.65 + i * 1.3) * radius * 0.42
        const wg = ctx.createRadialGradient(wx, wy, 0, wx, wy, radius * 0.28)
        const wa = 0.11 * Math.abs(Math.sin(wt * 0.8 + i))
        if (light) {
          wg.addColorStop(0, `rgba(255,230,120,${wa})`)
          wg.addColorStop(1,  "rgba(0,0,0,0)")
        } else {
          wg.addColorStop(0, `rgba(70,120,255,${wa})`)
          wg.addColorStop(1,  "rgba(0,0,0,0)")
        }
        ctx.beginPath()
        ctx.arc(wx, wy, radius * 0.28, 0, Math.PI * 2)
        ctx.fillStyle = wg
        ctx.fill()
      }

      ctx.restore()

      // ── Rim / crescent light ──
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.clip()
      const rimShift = Math.sin(frame * 0.009) * radius * 0.08
      const rg = ctx.createRadialGradient(
        cx + rimShift, cy - radius * 0.78, 0,
        cx, cy, radius
      )
      if (light) {
        rg.addColorStop(0,    `rgba(255,255,210,${0.65 + 0.15 * Math.sin(frame * 0.02)})`)
        rg.addColorStop(0.28,  "rgba(255,220,100,0.20)")
        rg.addColorStop(1,     "rgba(0,0,0,0)")
      } else {
        rg.addColorStop(0,    `rgba(200,225,255,${0.60 + 0.15 * Math.sin(frame * 0.02)})`)
        rg.addColorStop(0.28,  "rgba(110,160,255,0.18)")
        rg.addColorStop(1,     "rgba(0,0,0,0)")
      }
      ctx.fillStyle = rg
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      ctx.restore()

      // ── Glowing edge ring ──
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      const er   = 0.45 + 0.15 * Math.sin(frame * 0.022)
      ctx.strokeStyle = light
        ? `rgba(255,210,80,${er})`
        : `rgba(100,155,255,${er})`
      ctx.lineWidth   = 1.8
      ctx.shadowColor = light ? "rgba(255,180,40,0.6)" : "rgba(80,130,255,0.6)"
      ctx.shadowBlur  = 12
      ctx.stroke()
      ctx.restore()

      // ── Particles ──
      for (const p of particles) {
        p.x   += p.vx
        p.y   += p.vy
        p.life++
        if (p.life > p.maxLife) {
          const a  = Math.random() * Math.PI * 2
          const d  = radius * 1.25 + Math.random() * radius * 1.1
          p.x      = Math.cos(a) * d
          p.y      = Math.sin(a) * d
          p.life   = 0
          p.maxLife = 140 + Math.random() * 120
        }
        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.55
        ctx.beginPath()
        ctx.arc(cx + p.x, cy + p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = light
          ? `rgba(210,140,30,${alpha})`
          : `rgba(110,155,255,${alpha})`
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animRef.current)
    }
  }, []) // run once — reads mode via modeRef

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Navigation */}
      <div className="relative z-10">
        <Navigation />
      </div>

      {/* ── Floating Icons ── */}
      {[
        { Icon: TrendingUp,       top: "14%", left: "22%",  delay: 0.4,  dur: 3.2, label: "Growth"      },
        { Icon: CandlestickChart, top: "10%", left: "62%",  delay: 0.7,  dur: 2.8, label: "Candles"     },
        { Icon: Briefcase,        top: "30%", left: "12%",  delay: 1.0,  dur: 3.6, label: "Briefcase"   },
        { Icon: IndianRupee,      top: "28%", left: "78%",  delay: 0.5,  dur: 3.0, label: "Rupee"       },
        { Icon: Lightbulb,        top: "48%", left: "20%",  delay: 0.9,  dur: 2.6, label: "Idea"        },
        { Icon: BarChart2,        top: "46%", left: "72%",  delay: 0.6,  dur: 3.4, label: "Graph"       },
      ].map(({ Icon, top, left, delay, dur, label }, i) => (
        <motion.div
          key={label}
          className="absolute z-20 pointer-events-none"
          style={{ top, left }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Continuous float */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, i % 2 === 0 ? 6 : -6, 0] }}
            transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {/* Icon pill */}
            <div
              style={{
                width: "clamp(38px,5vw,52px)",
                height: "clamp(38px,5vw,52px)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isLight
                  ? "rgba(255,248,225,0.72)"
                  : "rgba(12,20,44,0.68)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: isLight
                  ? "1px solid rgba(200,150,40,0.30)"
                  : "1px solid rgba(100,150,255,0.20)",
                boxShadow: isLight
                  ? "0 4px 18px rgba(180,120,20,0.18), inset 0 1px 0 rgba(255,255,255,0.7)"
                  : "0 4px 18px rgba(0,0,0,0.40), inset 0 1px 0 rgba(120,170,255,0.08)",
              }}
            >
              <Icon
                size={Math.min(22, 18)}
                style={{ color: isLight ? "#8B5E14" : "#8AADFF" }}
                strokeWidth={1.6}
              />
            </div>
            {/* Label */}
            <span
              style={{
                fontSize: "clamp(0.44rem,0.9vw,0.58rem)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: isLight ? "rgba(90,55,10,0.55)" : "rgba(140,175,255,0.55)",
              }}
            >
              {label}
            </span>
          </motion.div>
        </motion.div>
      ))}

      {/* Text — sits below the sphere (~65% down) */}
      <div className="absolute inset-x-0 z-10 flex flex-col items-center pointer-events-none"
        style={{ top: "62%" }}>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            letterSpacing: "0.52em",
            fontSize: "clamp(0.75rem, 1.8vw, 1.1rem)",
            fontWeight: 300,
            color: isLight ? "rgba(60,30,5,0.82)" : "rgba(215,228,255,0.88)",
            textTransform: "uppercase",
            paddingLeft: "0.52em",
            marginBottom: "0.55rem",
          }}
        >
          Coming Soon
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "clamp(72px, 11vw, 150px)",
            height: "1px",
            background: isLight
              ? "linear-gradient(to right,transparent,rgba(150,90,15,0.5),transparent)"
              : "linear-gradient(to right,transparent,rgba(100,145,255,0.55),transparent)",
            marginBottom: "0.6rem",
            transformOrigin: "center",
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.3 }}
          style={{
            letterSpacing: "0.26em",
            fontSize: "clamp(0.48rem, 1vw, 0.65rem)",
            fontWeight: 400,
            color: isLight ? "rgba(90,50,8,0.38)" : "rgba(155,178,220,0.35)",
            textTransform: "uppercase",
            paddingLeft: "0.26em",
          }}
        >
          Financial Guidance by Shobha Poojari
        </motion.p>
      </div>
    </div>
  )
}

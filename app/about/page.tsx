"use client";

import { useRef } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useTheme } from "@/hooks/useTheme";
import { Award, BookOpen, Users, Lightbulb } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

// --- Cinematic Animation Physics ---
const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cinematicStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.1,
    },
  },
};

const cinematicReveal = {
  hidden: { opacity: 0, y: 30, scale: 0.95, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: premiumEasing },
  },
};

const narrativeSweepLeft = {
  hidden: { opacity: 0, x: -40, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1.0, ease: premiumEasing } }
};

const narrativeSweepRight = {
  hidden: { opacity: 0, x: 40, filter: "blur(4px)", scale: 0.98 },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", scale: 1, transition: { duration: 1.2, ease: premiumEasing, delay: 0.3 } }
};

const microPop = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(2px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: premiumEasing } }
};

export default function AboutPage() {
  // Hero Parallax
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);

  // Story Image Parallax
  const storyRef = useRef<HTMLElement>(null);
  const { scrollYProgress: storyScroll } = useScroll({ target: storyRef, offset: ["start end", "end start"] });
  const storyImgY = useTransform(storyScroll, [0, 1], ["15%", "-15%"]);
  const { isLight } = useTheme();

  return (
    <main
      style={{
        '--fin-bg-primary': isLight ? '#F7F2E8' : '#0F172A',
        '--fin-bg-secondary': isLight ? '#EBE5D8' : '#1A2847',
        '--fin-bg-accent': isLight ? '#DFD8CC' : '#243456',
        '--fin-gradient-hero': isLight ? 'linear-gradient(135deg, #FBF8F2 0%, #F7F2E8 50%, #EBE5D8 100%)' : 'linear-gradient(135deg, #0F172A 0%, #1A2847 50%, #243456 100%)',
        '--fin-text-primary': isLight ? '#3E3730' : '#E0E7FF',
        '--fin-text-secondary': isLight ? '#645E56' : '#C7D2FE',
        '--fin-text-light': isLight ? '#8A847C' : '#A5B4FC',
        '--fin-accent-gold': isLight ? '#D1AF62' : '#4FD1FF',
        '--fin-accent-soft-gold': isLight ? '#E0C991' : '#3B82F6',
        '--fin-border-light': isLight ? '#D6CCBE' : '#4FD1FF',
        '--fin-border-divider': isLight ? '#A38970' : '#334155'
      } as React.CSSProperties}
      className={`${isLight ? 'bg-[var(--fin-bg-primary)]' : 'bg-[#0F172A]'} min-h-screen text-[var(--fin-text-primary)] transition-colors duration-500 font-sans`}
    >
      <Navigation />

      {/* HERO – CINEMATIC BRAND INTRO */}
      <section 
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[var(--fin-border-light)] perspective-1000"
      >
        {/* Parallax Background Container */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, background: 'var(--fin-gradient-hero)' }}
          className="absolute inset-0 z-0 will-change-transform"
        >
          {/* Subtle Ambient Blobs */}
          <motion.div
            className="absolute w-96 h-96 bg-[var(--fin-accent-gold)]/10 rounded-full blur-[100px] top-10 left-10 mix-blend-multiply"
            animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[30rem] h-[30rem] bg-[var(--fin-border-divider)]/10 rounded-full blur-[120px] bottom-10 right-10 mix-blend-overlay"
            animate={{ y: [0, -40, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* HERO CONTENT */}
        <motion.div
          variants={cinematicStagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-6 flex flex-col items-center mt-10"
        >
          {/* Role */}
          <motion.p
            variants={cinematicReveal}
            className="uppercase tracking-[0.2em] text-[var(--fin-text-secondary)] mb-6 font-semibold text-sm"
          >
            Educator • CA • Trader
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={cinematicReveal}
            className={`text-6xl md:text-8xl font-extrabold tracking-tight text-[var(--fin-text-primary)] ${playfair.className} leading-tight drop-shadow-sm`}
          >
            Shobha Pujari
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={cinematicReveal}
            className="mt-6 text-xl md:text-2xl max-w-2xl mx-auto text-[var(--fin-text-secondary)] leading-relaxed font-light"
          >
            Making trading understandable, practical, and human across every phase of your financial journey.
          </motion.p>

          {/* Scroll Cue (Micro Interaction) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-20 text-[var(--fin-text-light)] text-sm tracking-widest uppercase flex flex-col items-center gap-3"
          >
            <span className="text-xs">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-12 bg-gradient-to-b from-[var(--fin-accent-gold)] to-transparent"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* STORY SECTION – NARRATIVE OVERLAP */}
      <section ref={storyRef} className="py-32 bg-[var(--fin-bg-primary)] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5 relative z-20"
          >
            <motion.div variants={narrativeSweepLeft}>
              <h2 className={`text-5xl font-bold mb-8 text-[var(--fin-text-primary)] ${playfair.className} leading-snug`}>
                I am Shobha Pujari, <br /> <span className="text-[var(--fin-accent-gold)]">a Chartered Accountant</span>
              </h2>
              <div className="space-y-6 text-lg text-[var(--fin-text-secondary)] leading-relaxed font-light">
                <p>
                qualified by the Institute of Chartered Accountants of India (ICAI), with 9 years of rich industry experience.I Currently serve as a Consultant at 5paisa, delivering expert financial advisory, risk management, and strategic solutions in the fintech domain.
                </p>
                <p>
                  In 2021, I was recognised by <strong className="font-semibold text-[var(--fin-text-primary)]">the University of Southampton</strong>the University of Southampton for my  contributions to the profession. 
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-7 relative h-[600px] rounded-3xl overflow-hidden group shadow-[0_40px_80px_-20px_rgba(62,55,48,0.15)] bg-[var(--fin-bg-secondary)] border border-[var(--fin-border-light)]"
          >
            <motion.div variants={narrativeSweepRight} className="absolute inset-0 w-full h-full">
              {/* Subtle internal gold glowing mask */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--fin-text-primary)]/10 to-transparent z-10 pointer-events-none group-hover:from-[var(--fin-accent-gold)]/10 transition-colors duration-700" />
              
              <motion.img
                style={{ y: storyImgY }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.8, ease: premiumEasing }}
                src="/professional-woman-chartered-accountant-trading-ed.jpg"
                alt="Shobha Pujari"
                className="absolute inset-0 w-full h-[130%] object-cover object-center will-change-transform origin-center"
              />
            </motion.div>
          </motion.div>
          
        </div>
      </section>

      {/* CREDENTIALS – HIGH IMPACT POP-INS */}
      <section className="py-32 bg-[var(--fin-bg-secondary)] relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--fin-accent-gold)]/20 to-transparent" />
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={cinematicStagger}
          className="max-w-6xl mx-auto px-6"
        >
          <motion.h2
            variants={cinematicReveal}
            className={`text-4xl md:text-5xl font-bold text-center mb-20 text-[var(--fin-text-primary)] ${playfair.className}`}
          >
            Built on Real Credibility
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { stat: "CA", label: "Chartered Accountant" },
              { stat: "Certified", label: "Trading Professional" },
              { stat: "15+", label: "Years Experience" },
              { stat: "5,000+", label: "Students Trained" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={microPop}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.4, ease: premiumEasing }}
                className="group rounded-2xl bg-[var(--fin-bg-primary)] p-8 text-center border border-[var(--fin-border-light)] hover:border-[var(--fin-accent-gold)]/50 transition-colors duration-500 shadow-sm hover:shadow-xl relative overflow-hidden"
              >
                {/* Micro Hover Glow */}
                <div className="absolute inset-0 bg-[var(--fin-accent-gold)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <h3 className={`text-4xl font-black text-[var(--fin-text-primary)] mb-4 ${playfair.className} group-hover:text-[var(--fin-accent-gold)] transition-colors duration-500`}>
                  {item.stat}
                </h3>
                <p className="font-medium text-[var(--fin-text-secondary)] tracking-wide">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* TEACHING STYLE – ALTERNATING NARRATIVE (NOT GRID) */}
      <section className="py-32 bg-[var(--fin-bg-primary)] border-t border-[var(--fin-border-light)]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cinematicReveal}
            className="text-center mb-20"
          >
            <h2 className={`text-4xl md:text-5xl font-bold text-[var(--fin-text-primary)] ${playfair.className}`}>
              How I Teach Differently
            </h2>
          </motion.div>

          {/* Sequential Alternating Flow */}
          <div className="space-y-24">
            {[
              {
                icon: Lightbulb,
                title: "No Overcomplication",
                text: "We dismantle confusing indicators and rely strictly on clear, robust frameworks. It's about signal over noise.",
                align: "left"
              },
              {
                icon: BookOpen,
                title: "Market Reality Interface",
                text: "No theoretical perfection. We study live charts, dissect real mistakes, and embrace the messy reality of active markets.",
                align: "right"
              },
              {
                icon: Users,
                title: "Community Intelligence",
                text: "Trading often feels incredibly lonely. Learning alongside a dedicated network guarantees shared knowledge.",
                align: "left"
              }
            ].map((item, i) => {
              const Icon = item.icon;
              const isLeft = item.align === "left";
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-150px" }}
                  variants={isLeft ? narrativeSweepLeft : narrativeSweepRight}
                  className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${isLeft ? '' : 'md:flex-row-reverse'}`}
                >
                  {/* Icon Block */}
                  <div className="shrink-0 group">
                    <div className="w-24 h-24 rounded-full bg-[var(--fin-bg-secondary)] border border-[var(--fin-border-divider)] flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:bg-[var(--fin-bg-primary)] shadow-sm">
                      <Icon className="text-[var(--fin-accent-gold)] transition-transform duration-500 group-hover:rotate-12" size={36} />
                    </div>
                  </div>
                  
                  {/* Text Block */}
                  <div className={`flex-1 ${isLeft ? 'md:text-left' : 'md:text-right'} text-center md:text-left`}>
                    <h3 className={`text-3xl font-bold mb-4 text-[var(--fin-text-primary)] ${playfair.className}`}>{item.title}</h3>
                    <p className="text-xl text-[var(--fin-text-secondary)] font-light leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST – CINEMATIC LIST REVEAL */}
      <section className="py-32 bg-[var(--fin-bg-secondary)] relative border-t border-[var(--fin-border-divider)]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={cinematicStagger}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <motion.h2
            variants={cinematicReveal}
            className={`text-4xl md:text-5xl font-bold mb-16 text-[var(--fin-text-primary)] ${playfair.className}`}
          >
            Why Beginners Stay
          </motion.h2>

          <div className="flex flex-col items-center space-y-4">
            {[
              "Beginner-first narrative explanations",
              "Live doubt clearing, completely unscripted",
              "No fabricated profit screenshots",
              "CA-backed structural financial discipline",
              "Lifetime community access & rolling course updates",
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={microPop}
                className="group relative w-full max-w-2xl bg-[var(--fin-bg-primary)] rounded-xl p-6 text-lg font-medium text-[var(--fin-text-primary)] border border-[var(--fin-border-light)] shadow-sm overflow-hidden"
              >
                {/* Reveal line */}
                <div className="absolute left-0 bottom-0 top-0 w-1 bg-[var(--fin-accent-gold)] scale-y-0 group-hover:scale-y-100 transition-transform duration-400 origin-bottom" />
                
                <span className="text-[var(--fin-accent-gold)] mr-4 font-bold tracking-widest">•</span>
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

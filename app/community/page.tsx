'use client';

import { useRef } from "react";
import { motion } from "framer-motion";
import HeroScene from "@/components/community/HeroScene";
import UIOverlay from "@/components/community/UIOverlay";
import StatsSection from "@/components/community/StatsSection";
import FeatureCards from "@/components/community/FeatureCards";
import PostsSection from "@/components/community/PostsSection";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useTheme } from "@/hooks/useTheme";

export default function CommunityPage() {
  const { isLight } = useTheme();

  // ── SAME blue palette family, dark vs light ────────────────────────────
  const separatorGradient = isLight
    ? "linear-gradient(to right, transparent, rgba(212,165,116,0.40), rgba(212,165,116,0.38), rgba(212,165,116,0.32), transparent)"
    : "linear-gradient(to right, transparent, rgba(79,209,255,0.5), rgba(59,130,246,0.5), rgba(139,92,246,0.5), transparent)";
  const separatorGlow = isLight
    ? "linear-gradient(to right, transparent, rgba(212,165,116,0.85), transparent)"
    : "linear-gradient(to right, transparent, rgba(79,209,255,1), transparent)";
  const dividerLine = isLight
    ? "linear-gradient(to right, transparent, rgba(212,165,116,0.20), rgba(212,165,116,0.16), transparent)"
    : "linear-gradient(to right, transparent, rgba(79,209,255,0.2), rgba(59,130,246,0.2), transparent)";

  return (
    <div style={{
      background: isLight ? "#EDE0C4" : "#050816",
      minHeight: "100vh",
      color: isLight ? "#000000" : "#EAF2FF",
      fontFamily: "'Inter', sans-serif",
      transition: "background 0.6s ease, color 0.4s ease",
    }}>

      {/* ── FIXED FULL-PAGE CINEMATIC BACKGROUND ── */}
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}>
        <HeroScene />
      </div>

      {/* ── SCROLLABLE CONTENT (on top of fixed bg) ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navigation /> 

        {/* Hero section — full viewport, no bg of its own */}
        <section style={{
          position: "relative",
          height: "100vh",
          minHeight: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <UIOverlay />
        </section>

        {/* Animated separator */}
        <div style={{ position: "relative", height: "2px", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: separatorGradient,
            transition: "background 0.6s ease",
          }} />
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute", top: 0, left: 0, width: "25%", height: "100%",
              background: separatorGlow,
              filter: "blur(1px)",
              transition: "background 0.6s ease",
            }}
          />
        </div>

        <main>
          <StatsSection />

          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ height: "1px", background: dividerLine, transition: "background 0.6s ease" }} />
          </div>

          <FeatureCards />

          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ height: "1px", background: dividerLine, transition: "background 0.6s ease" }} />
          </div>

          <PostsSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}

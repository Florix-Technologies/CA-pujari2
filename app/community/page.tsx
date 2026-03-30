'use client';

import { useRef } from "react";
import { motion } from "framer-motion";
import HeroScene from "@/components/community/HeroScene";
import UIOverlay from "@/components/community/UIOverlay";
import StatsSection from "@/components/community/StatsSection";
import FeatureCards from "@/components/community/FeatureCards";
import PostsSection from "@/components/community/PostsSection";
import Navbar from "@/components/community/Navbar";
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
  const footerBorder = isLight
    ? "1px solid rgba(212,165,116,0.14)"
    : "1px solid rgba(79,209,255,0.08)";
  const footerGlow = isLight
    ? "radial-gradient(ellipse, rgba(212,165,116,0.10) 0%, transparent 70%)"
    : "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)";
  const logoBg = isLight
    ? "linear-gradient(135deg, #D4A574, #C99564)"
    : "linear-gradient(135deg, #4FD1FF, #3B82F6)";
  const logoShadow = isLight
    ? "0 2px 14px rgba(212,165,116,0.40)"
    : "0 0 14px rgba(79,209,255,0.4)";
  const footerTextColor = isLight
    ? "rgba(107,94,32,0.58)"
    : "rgba(165,180,252,0.45)";
  const footerTextMutColor = isLight
    ? "rgba(107,94,32,0.38)"
    : "rgba(165,180,252,0.25)";

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
        <Navbar />

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

        {/* Footer */}
        <footer style={{
          borderTop: footerBorder,
          padding: "52px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.6s ease",
        }}>
          <div style={{
            position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)",
            width: "400px", height: "180px",
            background: footerGlow,
            filter: "blur(40px)", pointerEvents: "none",
            transition: "background 0.6s ease",
          }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "18px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                background: logoBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", boxShadow: logoShadow,
                transition: "all 0.6s ease",
              }}>📈</div>
              <span style={{
                color: isLight ? "#000000" : "#EAF2FF",
                fontWeight: 700, fontSize: "1.1rem",
                transition: "color 0.4s ease",
              }}>TradeVerse</span>
            </div>
            <p style={{ color: footerTextColor, fontSize: "0.85rem", transition: "color 0.4s ease" }}>
              © 2026 TradeVerse. Built for traders, by traders.
            </p>
            <p style={{ color: footerTextMutColor, fontSize: "0.75rem", marginTop: "8px", transition: "color 0.4s ease" }}>
              Trading involves risk. Past performance is not indicative of future results.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

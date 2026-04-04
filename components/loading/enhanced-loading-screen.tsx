"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"

interface EnhancedLoadingScreenProps {
  isLight: boolean
  onComplete: () => void
}

export function EnhancedLoadingScreen({ isLight, onComplete }: EnhancedLoadingScreenProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Show favicon for 1.5 seconds then exit directly to website
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        onComplete()
      }, 600)
    }, 1500)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background: isLight
              ? 'linear-gradient(135deg, #E8F4F8 0%, #D0E8F0 50%, #E8F4F8 100%)'
              : 'linear-gradient(135deg, #0A1628 0%, #0F1B2E 50%, #0A1628 100%)'
          }}
        >
          {/* ONLY FAVICON ANIMATION */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.6, 0.01, 0.05, 0.95]
            }}
            className="relative"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0px rgba(59, 130, 246, 0)',
                  `0 0 50px ${isLight ? 'rgba(59, 130, 246, 0.7)' : 'rgba(147, 197, 253, 0.7)'}`,
                  `0 0 80px ${isLight ? 'rgba(59, 130, 246, 0.5)' : 'rgba(147, 197, 253, 0.5)'}`,
                  '0 0 0px rgba(59, 130, 246, 0)',
                ]
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut"
              }}
              className="rounded-full p-6"
            >
              <Image
                src="/faviconSP.png"
                alt="Logo"
                width={120}
                height={120}
                className="rounded-full"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

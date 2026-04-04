"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface LoadingScreenProps {
  isLight: boolean
  onComplete: () => void
}

export function LoadingScreen({ isLight, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Smooth percentage increment
    const duration = 2000 // 2 seconds total loading time
    const steps = 100
    const interval = duration / steps

    let currentProgress = 0
    const timer = setInterval(() => {
      currentProgress += 1
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(timer)
        // Wait a bit before starting exit animation
        setTimeout(() => {
          setIsExiting(true)
          // Call onComplete after exit animation finishes
          setTimeout(onComplete, 800)
        }, 300)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: isLight
              ? 'linear-gradient(135deg, #F7F2E8 0%, #EDE5D0 50%, #F7F2E8 100%)'
              : 'linear-gradient(135deg, #0F172A 0%, #1A2847 50%, #0F172A 100%)'
          }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: isLight ? '#D1AF62' : '#4FD1FF',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.3
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* Main loading container */}
          <div className="relative z-10 text-center">
            {/* Percentage Display */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <motion.div
                className="text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter"
                style={{
                  background: isLight
                    ? 'linear-gradient(135deg, #D1AF62, #A38970)'
                    : 'linear-gradient(135deg, #4FD1FF, #818CF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: isLight
                    ? 'drop-shadow(0 4px 8px rgba(209, 175, 98, 0.3))'
                    : 'drop-shadow(0 4px 8px rgba(79, 209, 255, 0.3))'
                }}
                animate={{
                  scale: progress === 100 ? [1, 1.1, 1] : 1
                }}
                transition={{
                  duration: 0.3
                }}
              >
                {progress}%
              </motion.div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '280px', opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative h-2 rounded-full mx-auto overflow-hidden"
              style={{
                backgroundColor: isLight ? 'rgba(163, 137, 112, 0.2)' : 'rgba(79, 209, 255, 0.2)'
              }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: isLight
                    ? 'linear-gradient(90deg, #D1AF62, #A38970)'
                    : 'linear-gradient(90deg, #4FD1FF, #818CF8)',
                  boxShadow: isLight
                    ? '0 0 10px rgba(209, 175, 98, 0.5)'
                    : '0 0 10px rgba(79, 209, 255, 0.5)'
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </motion.div>

            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 text-sm md:text-base font-semibold tracking-[0.2em] uppercase"
              style={{
                color: isLight ? '#A38970' : '#CBD5E1'
              }}
            >
              {progress < 100 ? 'Loading Experience' : 'Ready'}
            </motion.p>

            {/* Pulsing Circle */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full -z-10"
              style={{
                background: isLight
                  ? 'radial-gradient(circle, rgba(209, 175, 98, 0.1), transparent 70%)'
                  : 'radial-gradient(circle, rgba(79, 209, 255, 0.1), transparent 70%)'
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

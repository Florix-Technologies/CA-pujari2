import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { ThemeProvider } from "@/hooks/useTheme"
import PageTransition from "@/components/page-transition"
import { AuthProvider } from "@/context/AuthContext"   // ✅ IMPORT THIS
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shobha Pujari | Chartered Accountant & Trading Educator",
  description:
    "Learn trading basics for beginners with India's trusted Chartered Accountant and trading educator",
  generator: "v0.app",
  icons: {
    icon: "/faviconSP.png",
    shortcut: "/faviconSP.png",
    apple: "/faviconSP.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical assets for faster loading */}
        <link rel="preload" href="/faviconSP.png" as="image" />
        {/* Preload hero images for NSE and Webinars */}
        <link rel="preload" href="/womentrading.png" as="image" />
        <link rel="preload" href="/women%20trading.png" as="image" />
      </head>
      <body className="font-sans antialiased">
        {/* 🔐 AUTH PROVIDER SHOULD BE OUTERMOST */}
        <AuthProvider>
          <ThemeProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </ThemeProvider>
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  )
}

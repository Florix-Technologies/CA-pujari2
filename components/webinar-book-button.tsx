"use client"

import Link from "next/link"
import { CreditCard } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function WebinarBookButton({ id, size }: { id: number | string, size?: "sm" | "md" | "lg" | string }) {
  const { user } = useAuth()

  const hrefIfLoggedIn = `/webinars/book/${id}`
  const redirectIfNot = `/login?redirect=${encodeURIComponent(`/webinars?book=${id}`)}`

  return user ? (
    <Link
      href={hrefIfLoggedIn}
      className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base whitespace-nowrap"
    >
      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="hidden xs:inline">Book Seat</span>
      <span className="xs:hidden">Book</span>
    </Link>
  ) : (
    <Link
      href={redirectIfNot}
      className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base whitespace-nowrap"
    >
      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="hidden xs:inline">Book Seat</span>
      <span className="xs:hidden">Book</span>
    </Link>
  )
}

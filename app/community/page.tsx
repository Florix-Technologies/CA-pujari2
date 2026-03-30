import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function CommunityPage() {
  return (
    <>
      <Navigation />

      {/* Header Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Trading Community</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Learn, share, and grow
            THIS PAGE IS UNDER CONSTRUCTION AND NEED TO BE INTEGRATED WTH SHREYA CHANGES
            with thousands of traders. Ask questions and share your experiences.
          </p>
        </div>
      </section>

      {/* Two-column intro section with image */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="w-full">
              <Image src="/community.png" alt="Community" width={800} height={600} className="rounded-2xl shadow-medium w-full h-auto object-cover" />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Community Hub</h2>
              <p className="text-muted-foreground mb-6">Learn, share strategies, and grow together with traders worldwide. No sign-up needed!</p>

              <div className="mb-6">
                <button className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold shadow-sm hover:opacity-95 transition">
                  Create Post
                </button>
              </div>

              <div className="py-8 border border-border rounded-xl bg-card p-6">
                <p className="text-muted-foreground">No posts yet. Be the first to share your trading insights!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

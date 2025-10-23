import type { Metadata } from "next"
import { MarbleBackground } from "@/components/marble-background"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactTracking } from "@/components/contact-tracking"
import { ContactSection } from "@/components/contact-section"

export const metadata: Metadata = {
  title: "Contact Us - Top Modern | Get Your Luxury Marble Quote",
  description:
    "Contact Top Modern for premium marble and granite solutions. Get expert consultation and quotes for your luxury hotel, restaurant, or real estate project.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#FAFAFA] relative overflow-hidden">
      <MarbleBackground />
      <ContactTracking />
      <Navigation />

      <main className="relative z-10 pt-32">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-8 text-balance">
              Let's Create Something
              <span className="text-[#D4AF37]"> Extraordinary</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#FAFAFA]/80 leading-relaxed">
              Ready to transform your space with premium marble and granite? Our experts are here to bring your vision
              to life.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}

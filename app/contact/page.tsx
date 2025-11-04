import type { Metadata } from "next"
import { Header } from "@/components/header"
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <ContactTracking />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl mb-8 text-balance">
              Let's Create Something
              <span className="text-primary"> Extraordinary</span>
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
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

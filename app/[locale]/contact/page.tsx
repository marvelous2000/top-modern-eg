import type { Metadata } from "next"
import { useTranslations } from 'next-intl';
import { Navigation } from "@/components/navigation"
import { ContactTracking } from "@/components/contact-tracking"
import { ContactSection } from "@/components/contact-section"


export const metadata: Metadata = {
  title: "Contact Us - Top Modern | Get Your Luxury Marble Quote",
  description:
    "Contact Top Modern for premium marble and granite solutions. Get expert consultation and quotes for your luxury hotel, restaurant, or real estate project.",
}

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <div className="flex flex-col">
      <Navigation />
      <ContactTracking />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl mb-8 text-balance">
              {t('title')}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection />
      </main>
    </div>
  )
}

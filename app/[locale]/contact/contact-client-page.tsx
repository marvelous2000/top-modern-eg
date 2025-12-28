'use client';

import { useTranslations } from 'next-intl';
import { Navigation } from "@/components/navigation"
import { ContactTracking } from "@/components/contact-tracking"
import { ContactSection } from "@/components/contact-section"

export default function ContactClientPage() {
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

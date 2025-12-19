"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PageCtaProps {
  title: string
  subtitle: string
  ctaLabel: string
  locale: string
}

export default function PageCtaClient({ title, subtitle, ctaLabel, locale }: PageCtaProps) {
  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-6">{title}</h2>
      <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">{subtitle}</p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <Button asChild size="lg" variant="primary">
          <Link href={`/${locale}/contact`}>{ctaLabel}</Link>
        </Button>
      </div>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
import { ParallaxHero } from "@/components/ui/parallax-hero"
import type { ReactNode } from "react"

interface HomeHeroClientProps {
  heroTitle: string
  heroSubtitle: string
  exploreProductsLabel: string
  contactUsLabel: string
  currentLocale: string
}

export default function HomeHeroClient({
  heroTitle,
  heroSubtitle,
  exploreProductsLabel,
  contactUsLabel,
  currentLocale,
}: HomeHeroClientProps) {
  return (
    <ParallaxHero
      backgroundImage="/marble-texture.png"
      className="border-b border-border bg-gradient-to-b from-secondary/50 to-background"
    >
      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl font-bold leading-tight tracking-tight text-balance md:text-5xl lg:text-6xl"
          >
            {heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl"
          >
            {heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={`/${currentLocale}/products`}>
                {exploreProductsLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              <Link href={`/${currentLocale}/contact`}>{contactUsLabel}</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ opacity: { delay: 1 }, y: { repeat: Number.POSITIVE_INFINITY, duration: 2 } }}
            className="mt-16 flex justify-center"
          >
            <ChevronDown className="h-6 w-6 text-muted-foreground" />
          </motion.div>
        </div>
      </div>
    </ParallaxHero>
  )
}

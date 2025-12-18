"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useParams } from 'next/navigation';
import { getSafeLocale } from '@/lib/locale-utils';
import { Navigation } from "@/components/navigation" // Keep Navigation here for now, will assess if Header is better
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedSection } from "@/components/ui/animated-section"
import { ParallaxHero } from "@/components/ui/parallax-hero"
import { StaggerContainer, itemVariants } from "@/components/ui/stagger-container"
import { StoneCard } from "@/components/ui/stone-card"
import { PageTransition } from "@/components/ui/page-transition"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Award, Users, Sparkles, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { getFeaturedProjects } from "@/lib/actions/projects" // Import getFeaturedProjects
import type { Project } from "@/lib/actions/projects" // Import Project type

// New client component for carousel logic
import FeaturedProjectsCarouselClient from "./_components/featured-projects-carousel-client"


export default function HomePage() { // Changed to async server component
  const t = useTranslations("HomePage")
  const params = useParams();
  const currentLocale = getSafeLocale(params.locale);

  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await getFeaturedProjects();
        if (result.success && result.data) {
          setFeaturedProjects(result.data);
        } else {
          setError(result.error || "Failed to fetch featured projects");
        }
      } catch (err: any) {
        console.error("Failed to fetch featured projects:", err);
        setError(err.message || "Failed to fetch featured projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []); // Empty dependency array means this runs once on mount


  if (loading) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen justify-center items-center">
          <p className="text-xl text-muted-foreground">Loading page content...</p>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen justify-center items-center">
          <p className="text-xl text-red-500">Error: {error}</p>
        </div>
      </PageTransition>
    );
  }


  return (
    <PageTransition>
      <div className="flex flex-col">
        <Navigation />

        <main className="flex-1">
          {/* Hero Section with Parallax */}
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
                  {t("heroTitle")}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl"
                >
                  {t("heroSubtitle")}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href={`/${currentLocale}/products`}>
                      {t("exploreProducts")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    <Link href={`/${currentLocale}/contact`}>{t("contactUs")}</Link>
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

          {/* Recent Projects Carousel - Now handled by client component */}
          <section className="py-20 bg-secondary/20">
            <div className="container mx-auto px-4">
              <div className="mx-auto w-full max-w-[90%] md:max-w-[80%]">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">{t('recent_projects_title')}</h2>
                  <p className="mt-4 text-lg text-muted-foreground">{t('recent_projects_subtitle')}</p>
                </div>

                <FeaturedProjectsCarouselClient projects={featuredProjects} currentLocale={currentLocale} />

              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="border-b border-border bg-secondary/30 py-20">
            <div className="container mx-auto px-4">
              <AnimatedSection className="mx-auto max-w-2xl text-center">
                <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">{t('why_choose_us_title')}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {t('why_choose_us_subtitle')}
                </p>
              </AnimatedSection>

              <StaggerContainer className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: Award,
                    title: t('quality_title'),
                    description: t('quality_description'),
                  },
                  {
                    icon: Users,
                    title: t('craftsmen_title'),
                    description: t('craftsmen_description'),
                  },
                  {
                    icon: Sparkles,
                    title: t('design_title'),
                    description: t('design_description'),
                  },
                  {
                    icon: CheckCircle2,
                    title: t('satisfaction_title'),
                    description: t('satisfaction_description'),
                  },
                ].map((item, index) => (
                  <motion.div key={index} variants={itemVariants} transition={{ ease: [0.4, 0, 0.2, 1] }}>
                    <Card className="border-border bg-card">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20"
                          >
                            <item.icon className="h-6 w-6 text-gold-600" />
                          </motion.div>
                          <h3 className="mt-4 font-semibold text-lg">{item.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* Featured Products Section */}
          <section className="border-b border-border py-20">
            <div className="container mx-auto px-4">
              <AnimatedSection className="mx-auto max-w-2xl text-center">
                <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">{t('featured_collections_title')}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {t('featured_collections_subtitle')}
                </p>
              </AnimatedSection>

              <StaggerContainer className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    image: "/white-marble-slab.jpg",
                    title: t('product_type_marble'),
                    description: t('product_type_marble_description'),
                    href: "/products#marble",
                  },
                  {
                    image: "/black-granite-countertop.jpg",
                    title: t('product_type_granite'),
                    description: t('product_type_granite_description'),
                    href: "/products#granite",
                  },
                  {
                    image: "/white-quartz-countertop.jpg",
                    title: t('product_type_quartz'),
                    description: t('product_type_quartz_description'),
                    href: "/products#quartz",
                  },
                ].map((product, index) => (
                  <motion.div key={index} variants={itemVariants} transition={{ ease: [0.4, 0, 0.2, 1] }}>
                    <StoneCard {...product} />
                  </motion.div>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* CTA Section */}
          <AnimatedSection>
            <section className="bg-black py-20 text-white">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                    {t('cta_title')}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed opacity-90">
                    {t('cta_subtitle')}
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild size="lg" variant="secondary" className="mt-8 w-full sm:w-auto">
                      <Link href="/contact">{t('cta.getStarted')}</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </section>
          </AnimatedSection>
        </main>
      </div>
    </PageTransition>
  )
}

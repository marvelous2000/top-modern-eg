"use client"

import { useTranslations } from "next-intl"
import { useParams } from 'next/navigation';
import { getSafeLocale } from '@/lib/locale-utils';
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedSection } from "@/components/ui/animated-section"
import { ParallaxHero } from "@/components/ui/parallax-hero"
import { StaggerContainer, itemVariants } from "@/components/ui/stagger-container"
import { StoneCard } from "@/components/ui/stone-card"
import { PageTransition } from "@/components/ui/page-transition"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Award, Users, Sparkles, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useCallback, useEffect } from "react"

export default function HomePage() {
  const t = useTranslations("HomePage")
  const params = useParams();
  const currentLocale = getSafeLocale(params.locale);
  const [currentSlide, setCurrentSlide] = useState(0)
  const projects = [
    { image: "/luxury-marble-kitchen.png", id: 0 },
    { image: "/carrara-marble-bathroom-with-elegant-vanity.jpg", id: 1 },
    { image: "/luxury-hotel-lobby-marble-installation-four-season.jpg", id: 2 },
    { image: "/carrara-marble-flooring-in-luxury-hotel-lobby.jpg", id: 3 },
    { image: "/luxury-marble-workshop-with-craftsmen-working-on-p.jpg", id: 4 },
  ]

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [projects.length])

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

          {/* Recent Projects Carousel */}
          <section className="py-20 bg-secondary/20">
            <div className="container mx-auto px-4">
              <div className="mx-auto w-full max-w-[90%] md:max-w-[80%]">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">{t('recent_projects_title')}</h2>
                  <p className="mt-4 text-lg text-muted-foreground">{t('recent_projects_subtitle')}</p>
                </div>

                <div className="relative">
                  <Carousel
                    opts={{
                      align: "center",
                      loop: true,
                      skipSnaps: false,
                      dragFree: false,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 5000,
                        stopOnInteraction: false,
                        stopOnMouseEnter: false,
                      }),
                    ]}
                    className="w-full"
                  >
                    <CarouselContent className="ml-0">
                      {projects.map((project, index) => (
                        <CarouselItem key={index} className="pl-0 basis-full">
                          <Card className="overflow-hidden shadow-lg border-0 bg-card">
                            <div className="relative aspect-[16/10] overflow-hidden">
                              <motion.div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{ backgroundImage: `url(${project.image})` }}
                                initial={{ scale: 1 }}
                                animate={{ scale: 1.05 }}
                                transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                                key={`zoom-${index}`}
                              />
                            </div>
                            <CardContent className="p-6 md:p-8">
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                                    {t(`projects.${project.id}.title`)}
                                  </h3>
                                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                                    {t(`projects.${project.id}.description`)}
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t('project_date')}</p>
                                    <p className="text-foreground font-semibold">{t(`projects.${project.id}.date`)}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t('project_location')}</p>
                                    <p className="text-foreground font-semibold">{t(`projects.${project.id}.location`)}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t('project_client')}</p>
                                    <p className="text-foreground font-semibold">{t(`projects.${project.id}.client`)}</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  {/* Radio-style indicators */}
                  <div className="flex justify-center mt-6 space-x-2">
                    {projects.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide ? 'bg-accent scale-125' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                        }`}
                        aria-label={t('go_to_slide', { slide: index + 1 })}
                      />
                    ))}
                  </div>
                </div>
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
                            <item.icon className="h-6 w-6 text-accent" />
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
                    href: `/${currentLocale}/products#marble`,
                  },
                  {
                    image: "/black-granite-countertop.jpg",
                    title: t('product_type_granite'),
                    description: t('product_type_granite_description'),
                    href: `/${currentLocale}/products#granite`,
                  },
                  {
                    image: "/white-quartz-countertop.jpg",
                    title: t('product_type_quartz'),
                    description: t('product_type_quartz_description'),
                    href: `/${currentLocale}/products#quartz`,
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
                      <Link href={`/${currentLocale}/contact`}>{t('cta.getStarted')}</Link>
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

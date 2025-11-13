"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
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
  const [currentSlide, setCurrentSlide] = useState(0)
  const projects = [
    {
      image: "/luxury-marble-kitchen.png",
      title: "Luxury Kitchen Renovation",
      description: "Premium Carrara marble countertops with gold fixtures",
      location: "Dubai, UAE",
      date: "2024",
      client: "Al Maktoum Residence",
    },
    {
      image: "/carrara-marble-bathroom-with-elegant-vanity.jpg",
      title: "Elegant Bathroom Design",
      description: "Carrara marble vanity and flooring installation",
      location: "Abu Dhabi, UAE",
      date: "2024",
      client: "Emirates Palace Hotel",
    },
    {
      image: "/luxury-hotel-lobby-marble-installation-four-season.jpg",
      title: "Hotel Lobby Transformation",
      description: "Large-scale marble flooring for luxury hotel",
      location: "Sharjah, UAE",
      date: "2023",
      client: "Four Seasons Resort",
    },
    {
      image: "/carrara-marble-flooring-in-luxury-hotel-lobby.jpg",
      title: "Commercial Flooring",
      description: "High-traffic marble flooring solution",
      location: "Ras Al Khaimah, UAE",
      date: "2023",
      client: "Marina Mall Complex",
    },
    {
      image: "/luxury-marble-workshop-with-craftsmen-working-on-p.jpg",
      title: "Custom Workshop Installation",
      description: "Bespoke marble work surfaces for artisans",
      location: "Fujairah, UAE",
      date: "2024",
      client: "Artisan Stone Workshop",
    },
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
                  Timeless Elegance in Natural Stone
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl"
                >
                  Discover our curated collection of premium granite, marble, and quartz. Crafted for discerning clients
                  who demand excellence.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/products">
                      Explore Products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    <Link href="/contact">Contact Us</Link>
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
                  <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">Recent Projects</h2>
                  <p className="mt-4 text-lg text-muted-foreground">Showcasing our latest marble and stone installations</p>
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
                                    {project.title}
                                  </h3>
                                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                                    {project.description}
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Date</p>
                                    <p className="text-foreground font-semibold">{project.date}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Location</p>
                                    <p className="text-foreground font-semibold">{project.location}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Client</p>
                                    <p className="text-foreground font-semibold">{project.client}</p>
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
                        aria-label={`Go to slide ${index + 1}`}
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
                <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">Why Choose Top Modern</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Three decades of excellence in natural stone craftsmanship
                </p>
              </AnimatedSection>

              <StaggerContainer className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: Award,
                    title: "Premium Quality",
                    description: "Hand-selected stones from the finest quarries worldwide",
                  },
                  {
                    icon: Users,
                    title: "Expert Craftsmen",
                    description: "Skilled artisans with decades of stone fabrication experience",
                  },
                  {
                    icon: Sparkles,
                    title: "Custom Design",
                    description: "Tailored solutions to match your unique vision and style",
                  },
                  {
                    icon: CheckCircle2,
                    title: "Guaranteed Satisfaction",
                    description: "Comprehensive warranty and dedicated customer support",
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
                <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">Featured Collections</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Explore our most sought-after natural stone selections
                </p>
              </AnimatedSection>

              <StaggerContainer className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    image: "/white-marble-slab.jpg",
                    title: "Marble",
                    description: "Timeless beauty and sophistication for luxury interiors",
                    href: "/products#marble",
                  },
                  {
                    image: "/black-granite-countertop.jpg",
                    title: "Granite",
                    description: "Durable elegance that stands the test of time",
                    href: "/products#granite",
                  },
                  {
                    image: "/white-quartz-countertop.jpg",
                    title: "Quartz",
                    description: "Modern performance meets natural aesthetics",
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
                    Ready to Transform Your Space?
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed opacity-90">
                    Schedule a consultation with our stone experts today
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild size="lg" variant="secondary" className="mt-8 w-full sm:w-auto">
                      <Link href="/contact">Get Started</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </section>
          </AnimatedSection>
        </main>

        <Footer />
      </div>
    </PageTransition>
  )
}

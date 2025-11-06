"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedSection } from "@/components/ui/animated-section"
import { ParallaxHero } from "@/components/ui/parallax-hero"
import { StaggerContainer, itemVariants } from "@/components/ui/stagger-container"
import { StoneCard } from "@/components/ui/stone-card"
import { PageTransition } from "@/components/ui/page-transition"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Award, Users, Sparkles, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <PageTransition>
      <div className="flex flex-col">
        <Header />

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
                  <Button asChild size="lg" className="min-w-[160px]">
                    <Link href="/products">
                      Explore Products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="min-w-[160px] bg-transparent">
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
          <section className="relative w-full overflow-hidden">
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
                {[
                  {
                    image: "/luxury-marble-kitchen.png",
                    title: "Luxury Kitchen Renovation",
                    description: "Premium Carrara marble countertops with gold fixtures",
                    location: "Dubai, UAE",
                  },
                  {
                    image: "/carrara-marble-bathroom-with-elegant-vanity.jpg",
                    title: "Elegant Bathroom Design",
                    description: "Carrara marble vanity and flooring installation",
                    location: "Abu Dhabi, UAE",
                  },
                  {
                    image: "/luxury-hotel-lobby-marble-installation-four-season.jpg",
                    title: "Hotel Lobby Transformation",
                    description: "Large-scale marble flooring for luxury hotel",
                    location: "Sharjah, UAE",
                  },
                  {
                    image: "/carrara-marble-flooring-in-luxury-hotel-lobby.jpg",
                    title: "Commercial Flooring",
                    description: "High-traffic marble flooring solution",
                    location: "Ras Al Khaimah, UAE",
                  },
                  {
                    image: "/luxury-marble-workshop-with-craftsmen-working-on-p.jpg",
                    title: "Custom Workshop Installation",
                    description: "Bespoke marble work surfaces for artisans",
                    location: "Fujairah, UAE",
                  },
                ].map((project, index) => (
                  <CarouselItem key={index} className="pl-0 basis-full">
                    <div className="min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${project.image})` }}
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.05 }}
                        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                        key={`zoom-${index}`}
                      />
                      <div className="absolute inset-0 bg-foreground/15"></div>
                      <div className="absolute inset-0 flex items-end pb-16 md:pb-24">
                        <div className="container mx-auto px-4 md:px-8">
                          <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="max-w-4xl"
                          >
                            <motion.h2
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-accent mb-4 leading-tight drop-shadow-lg"
                            >
                              {project.title}
                            </motion.h2>
                            <motion.p
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8, delay: 0.4 }}
                              className="text-white/90 text-lg md:text-xl mb-3 max-w-2xl leading-relaxed drop-shadow-md"
                            >
                              {project.description}
                            </motion.p>
                            <motion.p
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8, delay: 0.6 }}
                              className="text-white/80 text-base md:text-lg font-medium drop-shadow-md"
                            >
                              {project.location}
                            </motion.p>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 h-12 w-12" />
              <CarouselNext className="hidden md:flex right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 h-12 w-12" />
            </Carousel>

            {/* Section Title Overlay */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-black/20 backdrop-blur-sm rounded-full px-6 py-3"
              >
                <h2 className="font-serif text-lg md:text-xl font-bold text-white">Recent Projects</h2>
              </motion.div>
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
                  <motion.div key={index} variants={itemVariants}>
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
                  <motion.div key={index} variants={itemVariants}>
                    <StoneCard {...product} />
                  </motion.div>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* CTA Section */}
          <AnimatedSection>
            <section className="bg-primary py-20 text-primary-foreground">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                    Ready to Transform Your Space?
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed opacity-90">
                    Schedule a consultation with our stone experts today
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild size="lg" variant="secondary" className="mt-8 min-w-[200px]">
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

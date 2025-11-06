"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedSection } from "@/components/ui/animated-section"
import { StaggerContainer, itemVariants } from "@/components/ui/stagger-container"
import { PageTransition } from "@/components/ui/page-transition"
import { TimelineItem } from "@/components/ui/timeline-item"
import { Award, Users, Target, Heart } from "lucide-react"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <AnimatedSection>
            <section className="border-b border-border bg-secondary/30 py-16">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                  <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">About Top Modern</h1>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    Three decades of excellence in natural stone craftsmanship
                  </p>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Story Section */}
          <AnimatedSection>
            <section className="border-b border-border py-16">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">Our Story</h2>
                  <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
                    <p>
                      Founded in 1994, Top Modern has been at the forefront of luxury natural stone fabrication and
                      installation. What began as a small family workshop has grown into one of the most trusted names
                      in premium stone solutions.
                    </p>
                    <p>
                      Our passion for natural stone goes beyond mere business—it's an art form. Each slab we select,
                      every cut we make, and all installations we complete are executed with meticulous attention to
                      detail and an unwavering commitment to excellence.
                    </p>
                    <p>
                      Today, we serve discerning residential and commercial clients across the nation, bringing timeless
                      elegance and unmatched quality to kitchens, bathrooms, lobbies, and beyond.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Our Journey Timeline */}
          <section className="border-b border-border py-20">
            <div className="container mx-auto px-4">
              <AnimatedSection className="mx-auto mb-16 max-w-2xl text-center">
                <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">Our Journey</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Three decades of growth, innovation, and commitment to excellence
                </p>
              </AnimatedSection>

              <div className="relative mx-auto max-w-4xl">
                <div className="space-y-16">
                  <TimelineItem year="1994" title="The Beginning" isLeft={true}>
                    <p>
                      Top Modern was founded as a small family workshop in Dubai, UAE. Our founders, with a vision
                      for bringing premium natural stone craftsmanship to the Middle East, started with just a handful
                      of skilled artisans and a commitment to quality that would define our legacy.
                    </p>
                  </TimelineItem>

                  <TimelineItem year="2005" title="Regional Expansion" isLeft={false}>
                    <p>
                      Recognizing the growing demand for luxury stone solutions, we expanded our operations across
                      the UAE. Our reputation for excellence in marble and granite fabrication began to spread,
                      establishing us as the go-to experts for discerning clients in Dubai, Abu Dhabi, and Sharjah.
                    </p>
                  </TimelineItem>

                  <TimelineItem year="2015" title="International Recognition" isLeft={true}>
                    <p>
                      Our craftsmanship caught the attention of international clients. We began serving luxury
                      hospitality projects and high-end residential developments across the Middle East, earning
                      recognition for our meticulous attention to detail and innovative stone solutions.
                    </p>
                  </TimelineItem>

                  <TimelineItem year="2024" title="Leading the Industry" isLeft={false}>
                    <p>
                      Today, Top Modern stands as one of the most trusted names in premium natural stone. With over
                      500 completed projects and a team of master craftsmen, we continue to push the boundaries of
                      what's possible in stone fabrication, serving clients across the UAE and beyond.
                    </p>
                  </TimelineItem>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="border-b border-border bg-secondary/30 py-16">
            <div className="container mx-auto px-4">
              <AnimatedSection className="mx-auto mb-12 max-w-2xl text-center">
                <h2 className="font-serif text-3xl font-bold tracking-tight">Our Values</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  The principles that guide everything we do
                </p>
              </AnimatedSection>

              <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: Award,
                    title: "Excellence",
                    description: "We never compromise on quality, sourcing only the finest materials",
                  },
                  {
                    icon: Users,
                    title: "Craftsmanship",
                    description: "Our skilled artisans bring decades of experience to every project",
                  },
                  {
                    icon: Target,
                    title: "Precision",
                    description: "Meticulous attention to detail ensures flawless results",
                  },
                  {
                    icon: Heart,
                    title: "Integrity",
                    description: "Honest communication and transparent pricing always",
                  },
                ].map((value, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="border-border bg-card">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20"
                          >
                            <value.icon className="h-6 w-6 text-accent" />
                          </motion.div>
                          <h3 className="mt-4 font-semibold text-lg">{value.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-base">{value.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* Team Section */}
          <AnimatedSection>
            <section className="border-b border-border py-16">
              <div className="container mx-auto px-4">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">Our Expertise</h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    What sets us apart in the industry
                  </p>
                </div>

                <div className="mx-auto max-w-3xl space-y-12">
                  {[
                    {
                      number: "30+",
                      title: "Years of Experience",
                      description: "Three decades of perfecting our craft and serving clients with distinction",
                    },
                    {
                      number: "500+",
                      title: "Projects Completed",
                      description: "From intimate residential spaces to grand commercial installations",
                    },
                    {
                      number: "100%",
                      title: "Client Satisfaction",
                      description: "Our commitment to excellence ensures every client is delighted with the results",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-6"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20"
                      >
                        <span className="font-serif text-xl font-bold text-accent">{stat.number}</span>
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-lg">{stat.title}</h3>
                        <p className="mt-2 leading-relaxed text-muted-foreground text-base">{stat.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* CTA Section */}
          <AnimatedSection>
            <section className="bg-primary py-16 text-primary-foreground">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">Experience the Top Modern Difference</h2>
                  <p className="mt-4 text-lg leading-relaxed opacity-90">
                    Discover why discerning clients choose us for their most important projects
                  </p>
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

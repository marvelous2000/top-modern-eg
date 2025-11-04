"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection } from "@/components/ui/animated-section"
import { StaggerContainer, itemVariants } from "@/components/ui/stagger-container"
import { PageTransition } from "@/components/ui/page-transition"
import { motion } from "framer-motion"

const projects = [
  {
    id: 1,
    title: "Modern Kitchen Renovation",
    location: "Beverly Hills, CA",
    material: "Calacatta Gold Marble",
    category: "Residential",
    image: "/placeholder.svg?key=rvqxe",
    description: "Complete kitchen transformation featuring premium marble countertops and backsplash",
  },
  {
    id: 2,
    title: "Luxury Hotel Lobby",
    location: "Manhattan, NY",
    material: "Nero Marquina Marble",
    category: "Commercial",
    image: "/placeholder.svg?key=yjqxe",
    description: "Grand entrance with dramatic black marble flooring and accent walls",
  },
  {
    id: 3,
    title: "Contemporary Bathroom Suite",
    location: "Miami, FL",
    material: "Carrara White Marble",
    category: "Residential",
    image: "/placeholder.svg?key=0yjqx",
    description: "Spa-like bathroom featuring elegant marble vanity and shower surround",
  },
  {
    id: 4,
    title: "Executive Office Building",
    location: "San Francisco, CA",
    material: "Absolute Black Granite",
    category: "Commercial",
    image: "/placeholder.svg?key=e0yjq",
    description: "Sophisticated reception area with polished granite surfaces",
  },
  {
    id: 5,
    title: "Outdoor Kitchen & Bar",
    location: "Austin, TX",
    material: "Kashmir White Granite",
    category: "Residential",
    image: "/placeholder.svg?key=xe0yj",
    description: "Weather-resistant granite countertops for outdoor entertaining space",
  },
  {
    id: 6,
    title: "Boutique Restaurant",
    location: "Chicago, IL",
    material: "Statuario Quartz",
    category: "Commercial",
    image: "/placeholder.svg?key=qxe0y",
    description: "Elegant dining space with custom quartz bar and table tops",
  },
]

export default function ProjectsPage() {
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <AnimatedSection>
            <section className="border-b border-border bg-secondary/30 py-16">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                  <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">Our Projects</h1>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    Explore our portfolio of exceptional stone installations across residential and commercial spaces
                  </p>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Projects Grid */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <motion.div key={project.id} variants={itemVariants}>
                    <Card className="group overflow-hidden border-border bg-card transition-shadow hover:shadow-lg">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="aspect-[4/3] overflow-hidden bg-muted"
                      >
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center gap-2">
                          <Badge variant="secondary">{project.category}</Badge>
                        </div>
                        <h3 className="font-serif text-xl font-semibold">{project.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{project.location}</p>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
                        <div className="mt-4 border-t border-border pt-4">
                          <p className="text-xs font-medium text-muted-foreground">Material Used</p>
                          <p className="mt-1 text-sm font-medium">{project.material}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* CTA Section */}
          <AnimatedSection>
            <section className="border-t border-border bg-primary py-16 text-primary-foreground">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">Start Your Project Today</h2>
                  <p className="mt-4 text-lg leading-relaxed opacity-90">
                    Let us bring your vision to life with our expert craftsmanship
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

"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/ui/animated-section"
import { StaggerContainer, itemVariants } from "@/components/ui/stagger-container"

import { motion } from "framer-motion"
import Link from "next/link"
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/actions/projects"

interface ProjectsPageClientProps {
  projects: Project[]
  locale: string
}

export function ProjectsPageClient({ projects, locale }: ProjectsPageClientProps) {
  const t = useTranslations("projects");

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-1 pt-16">
          {/* Hero Section */}
          <AnimatedSection>
            <section className="border-b border-border bg-secondary/30 py-16 md:py-20">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                  <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">{t("title")}</h1>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    {t("subtitle")}
                  </p>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Projects Grid */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              {projects.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No projects available at the moment.</p>
                </div>
              ) : (
                <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project, index) => (
                    <motion.div key={project.id} variants={itemVariants}>
                      <Card className="group overflow-hidden border-border bg-card transition-shadow">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          className="aspect-[4/3] overflow-hidden bg-muted"
                        >
                          <img
                            src={project.images[0] || "/placeholder.svg"}
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
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">{project.description}</p>
                          <div className="mt-4 border-t border-border pt-4">
                            <p className="text-xs font-medium text-muted-foreground">Materials Used</p>
                            <p className="mt-1 text-sm font-medium">{project.materials.join(", ")}</p>
                          </div>
                          <div className="mt-4 flex justify-center">
                            <Button asChild variant="link" className="p-0 text-accent hover:text-accent/80">
                              <Link href={`/${locale}/projects/${project.slug}`}>
                                {t("viewDetails")}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <AnimatedSection>
            <section className="border-t border-border bg-black py-16 text-white">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">{t("cta.readyToTransform")}</h2>
                  <p className="mt-4 text-lg leading-relaxed opacity-90">
                    {t("cta.scheduleConsultation")}
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild size="lg" className="btn btn-primary mt-8 w-full sm:w-auto">
                      <Link href={`/${locale}/contact`}>{t("cta.getStarted")}</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </section>
          </AnimatedSection>
        </main>
      </div>
  )
}

"use client"

import { useMemo, useState } from "react"
import type { Project } from "@/lib/actions/projects"
import { MarbleBackground } from "@/components/marble-background"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import { ContactTracking } from "@/components/contact-tracking"

type ProjectsPageClientProps = {
  projects: Project[]
}

const fallbackProjects: Array<Project & { slug: string }> = [
  {
    id: "fallback-1",
    slug: "four-seasons-cairo",
    title: "Four Seasons Hotel Cairo",
    category: "Hospitality",
    location: "Cairo, Egypt",
    year: "2023",
    client: "Four Seasons Hotels & Resorts",
    description: "Complete marble installation for luxury hotel lobby and suites.",
    challenge:
      "Creating a luxurious yet durable stone installation that could withstand high traffic while maintaining the Four Seasons' exacting standards for elegance and sophistication.",
    solution:
      "Selected premium Italian Carrara marble for the main lobby flooring, complemented by dramatic Nero Marquina marble feature walls.",
    results: ["15,000 sqm of premium marble installation", "Zero maintenance issues in first year"],
    materials: ["Carrara White Marble", "Nero Marquina Marble"],
    images: ["/luxury-hotel-lobby-marble-installation-four-season.jpg"],
    testimonial: {
      quote:
        "Top Modern delivered exceptional quality and service. Their attention to detail and commitment to excellence made them the perfect partner for our Cairo property.",
      author: "Sarah Johnson",
      position: "Regional Director of Operations, Four Seasons Hotels",
    },
    status: "active",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const projectData = projects.length ? projects : fallbackProjects

  const categories = useMemo(
    () => Array.from(new Set(projectData.map((project) => project.category))),
    [projectData],
  )
  const locations = useMemo(
    () => Array.from(new Set(projectData.map((project) => project.location))),
    [projectData],
  )

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")

  const filteredProjects = projectData.filter((project) => {
    const categoryMatch = selectedCategory === "all" || project.category === selectedCategory
    const locationMatch = selectedLocation === "all" || project.location === selectedLocation

    return categoryMatch && locationMatch
  })

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <MarbleBackground />
      <ContactTracking />
      <Navigation />

      <main className="relative z-10 pt-32">
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-h1 mb-8 text-balance">
              Signature <span className="text-primary">Projects</span>
            </h1>
            <p className="text-body text-muted-foreground">
              Explore our showcase of award-winning marble and granite installations across hospitality, residential,
              and commercial landmarks in the MENA region.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-start">
              <span className="text-primary font-semibold uppercase tracking-wide mb-4">Filter by Category</span>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground"
                      : "border border-primary text-primary hover:bg-primary/80 hover:text-primary-foreground"
                  }`}
                >
                  All Projects
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "border border-primary text-primary hover:bg-primary/80 hover:text-primary-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start">
              <span className="text-primary font-semibold uppercase tracking-wide mb-4">Filter by Location</span>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedLocation("all")}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
                    selectedLocation === "all"
                      ? "bg-primary text-primary-foreground"
                      : "border border-primary text-primary hover:bg-primary/80 hover:text-primary-foreground"
                  }`}
                >
                  All Locations
                </button>
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
                      selectedLocation === location
                        ? "bg-primary text-primary-foreground"
                        : "border border-primary text-primary hover:bg-primary/80 hover:text-primary-foreground"
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border border-primary/30 rounded-xl bg-card/80 backdrop-blur">
              <h3 className="text-h2 text-primary mb-3">Why Clients Choose Us</h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li>Premium marble and granite sourced from globally renowned quarries</li>
                <li>Expert fabrication, installation, and polishing teams</li>
                <li>Dedicated quality assurance and project management</li>
                <li>Comprehensive maintenance and aftercare services</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-12">
          <div className="grid gap-12">
            {filteredProjects.map((project) => (
              <article
                key={project.slug}
                className="grid lg:grid-cols-[1.1fr_1fr] border border-primary/20 rounded-3xl overflow-hidden bg-card/80 backdrop-blur min-h-[400px]"
              >
                <div className="relative">
                  <img
                    src={project.images?.[0] || "/placeholder.svg"}
                    alt={project.title}
                    className="h-full w-full min-h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/40" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-primary">
                      <span className="break-words">{project.category}</span>
                      <span className="text-muted-foreground">&bull;</span>
                      <span className="break-words">{project.location}</span>
                    </div>
                    <h2 className="mt-3 text-h2 text-foreground break-words line-clamp-2 leading-tight">
                      {project.title}
                    </h2>
                  </div>
                </div>

                <div className="space-y-6 bg-card/90 p-8 flex flex-col min-h-[400px]">
                  <div className="flex-1">
                    <p className="text-muted-foreground leading-relaxed mb-6 break-words line-clamp-4">
                      {project.description}
                    </p>

                    {project.results && project.results.length > 0 && (
                      <div className="grid gap-2 text-sm text-muted-foreground mb-6">
                        {project.results.slice(0, 3).map((result, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="mt-1 size-1.5 rounded-full bg-primary/80 shrink-0" aria-hidden="true" />
                            <span className="break-words">{result}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
                    <a
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-300 hover:bg-primary/80 hover:text-primary-foreground shrink-0"
                    >
                      View Case Study
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground break-words">
                      {project.year} &bull; {project.client}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-h2 text-primary mb-4">No projects found</h3>
              <p className="text-muted-foreground">
                Adjust your filters to explore more of our marble and granite installations across the region.
              </p>
            </div>
          )}
        </section>

        <section className="container mx-auto px-6 pb-24">
          <div className="rounded-3xl border border-primary/30 bg-card/90 p-12 text-center">
            <h2 className="text-h1 mb-6">
              Plan Your Next <span className="text-primary">Iconic Space</span>
            </h2>
            <p className="text-body text-muted-foreground mb-10">
              Partner with Top Modern for bespoke stone fabrication, precision installation, and dedicated craftsmanship
              trusted by world-class hospitality and real estate developers across the Middle East.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/contact"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/80 hover:text-primary-foreground transition-colors duration-300"
              >
                Request Consultation
              </a>
              <a
                href="mailto:info@topmodern.com"
                className="border border-primary text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("contactClick", {
                      detail: { type: "email", identifier: "info@topmodern.com", page: "/projects" },
                    }),
                  )
                }
              >
                Email Our Team
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

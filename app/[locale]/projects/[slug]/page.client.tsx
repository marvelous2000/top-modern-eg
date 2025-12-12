"use client"

import { notFound } from "next/navigation"
import { MarbleBackground } from "@/components/marble-background"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import { ContactTracking } from "@/components/contact-tracking"
import type { Project } from "@/lib/actions/projects"
import { cn } from "@/lib/utils"

type ProjectPageProps = {
  project: Project | undefined
  slug: string
}

export function ProjectPageClient({ project, slug }: ProjectPageProps) {
  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <MarbleBackground />
      <ContactTracking />
      <Navigation />

      <main className="relative z-10 pt-32">
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm uppercase tracking-[0.3em] text-accent">
              <span className="break-words">{project.category}</span>
              <span className="text-foreground/40">&bull;</span>
              <span className="break-words">{project.location}</span>
              <span className="text-foreground/40">&bull;</span>
              <span className="break-words">{project.year}</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-balance mb-6 break-words line-clamp-3 leading-tight">
              {project.title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed break-words line-clamp-4">
              {project.description}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 items-start">
            <div className="lg:col-span-2 space-y-10">
              <div className="relative overflow-hidden rounded-3xl border border-accent/30">
                <img
                  src={project.images[0] || "/placeholder.svg"}
                  alt={project.title}
                  className="h-auto w-full object-cover aspect-video max-h-[400px]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-8">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="break-words">
                      Client: <span className="text-foreground font-semibold break-words">{project.client}</span>
                    </span>
                    <span className="break-words">
                      Category: <span className="text-foreground font-semibold break-words">{project.category}</span>
                    </span>
                    <span className="break-words">
                      Location: <span className="text-foreground font-semibold break-words">{project.location}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-accent/20 bg-card/80 p-8">
                  <h2 className="font-serif text-2xl font-bold text-accent mb-4">Project Challenge</h2>
                  <p className="text-muted-foreground leading-relaxed break-words line-clamp-6">{project.challenge}</p>
                </div>
                <div className="rounded-2xl border border-accent/20 bg-card/80 p-8">
                  <h2 className="font-serif text-2xl font-bold text-accent mb-4">Our Solution</h2>
                  <p className="text-muted-foreground leading-relaxed break-words line-clamp-6">{project.solution}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-accent/20 bg-card/80 p-10">
                <h2 className="font-serif text-3xl font-bold text-accent mb-6">Project Highlights</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {project.results.map((result, index) => (
                    <div key={index} className="flex gap-4">
                      <span className="mt-1 size-2 rounded-full bg-accent shrink-0" aria-hidden="true" />
                      <p className="text-muted-foreground leading-relaxed break-words">{result}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-8">
              <div className="rounded-2xl border border-accent/20 bg-card/80 p-8">
                <h2 className="font-serif text-2xl font-bold text-accent mb-6">Project Details</h2>
                <dl className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <dt className="uppercase tracking-[0.3em] text-foreground/40 mb-1">Client</dt>
                    <dd className="text-lg text-foreground font-semibold break-words">{project.client}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.3em] text-foreground/40 mb-1">Location</dt>
                    <dd className="text-lg text-foreground font-semibold break-words">{project.location}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.3em] text-foreground/40 mb-1">Year</dt>
                    <dd className="text-lg text-foreground font-semibold break-words">{project.year}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.3em] text-foreground/40 mb-1">Category</dt>
                    <dd className="text-lg text-foreground font-semibold break-words">{project.category}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-accent/20 bg-card/80 p-8">
                <h2 className="font-serif text-2xl font-bold text-accent mb-6">Materials Used</h2>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {project.materials.map((material, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="mt-1 size-1.5 rounded-full bg-accent/80 shrink-0" aria-hidden="true" />
                      <span className="break-words">{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-10">
            Project <span className="text-accent">Gallery</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {project.images.slice(1).map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-2xl border border-accent/10">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${project.title} gallery image ${index + 2}`}
                  className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>

        {project.testimonial && (
          <section className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto text-center rounded-3xl border border-accent/30 bg-card/80 p-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8">
                Client <span className="text-accent">Testimonial</span>
              </h2>
              <blockquote className="text-2xl md:text-3xl font-serif italic text-foreground/85 leading-relaxed mb-8 break-words">
                "{project.testimonial.quote}"
              </blockquote>
              <div className="text-sm uppercase tracking-[0.3em] text-foreground/40 mb-2 break-words">
                {project.testimonial.position}
              </div>
              <div className="text-lg font-semibold text-accent break-words">{project.testimonial.author}</div>
            </div>
          </section>
        )}

        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center rounded-3xl border border-accent/30 bg-card/90 p-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Ready for Your <span className="text-accent">Next Project?</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 break-words">
              Let Top Modern deliver the same craftsmanship and attention to detail for your upcoming development.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/contact"
                className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent/90 transition-colors duration-300"
              >
                Start Your Project
              </a>
              <a
                href="tel:+201234567890"
                className="border border-accent text-accent px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("contactClick", {
                      detail: { type: "phone", identifier: "+201234567890", page: `/projects/${slug}` },
                    }),
                  )
                }
              >
                Call Expert
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ProjectPageClient
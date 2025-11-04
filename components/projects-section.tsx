"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getActiveProjects } from "@/lib/actions/projects"

// No fallback projects - always fetch from database

export function ProjectsSection() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await getActiveProjects()
        if (result.success) {
          setProjects(result.data.slice(0, 2)) // Show first 2 projects
        } else {
          setError(result.error || "Failed to fetch projects")
          setProjects([])
        }
      } catch (err) {
        console.error("[v0] Error fetching projects:", err)
        setError("Failed to fetch projects")
        setProjects([])
      }
      setLoading(false)
    }
    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section id="projects" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="projects" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-destructive">Failed to load projects. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section id="projects" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-h2 text-foreground mb-6">
              Signature <span className="text-primary gold-glow">Projects</span>
            </h2>
            <p className="text-body text-muted-foreground max-w-3xl mx-auto mb-8">
              Explore our portfolio of prestigious projects across the MENA region
            </p>
            <p className="text-xl text-muted-foreground">No projects available at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-h2 text-foreground mb-6">
            Signature <span className="text-primary gold-glow">Projects</span>
          </h2>
          <p className="text-body text-muted-foreground max-w-3xl mx-auto">
            Explore our portfolio of prestigious projects across the MENA region
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card
              key={project.id || index}
              className="bg-card/80 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all duration-300 group min-h-[500px] flex flex-col shadow-lg"
            >
              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="relative overflow-hidden">
                  <img
                    src={project.images?.[0] || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <Badge className="bg-primary text-black shrink-0">{project.category}</Badge>
                    <Badge variant="outline" className="border-white text-white break-words max-w-full">
                      {project.location}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-h3 text-foreground mb-3 break-words line-clamp-2 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-body-sm mb-4 flex-1 break-words line-clamp-3">
                    {project.description}
                  </p>
                  <div className="mt-auto">
                    <Button
                      variant="glass"
                      className="w-full group-hover:shadow-primary/20 transition-all duration-300"
                      asChild
                    >
                      <a href={`/projects/${project.slug || project.id}`}>
                        View Project Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

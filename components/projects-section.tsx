"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getActiveProjects } from "@/lib/actions/projects"

// Fallback project for when DB is not set up yet
const fallbackProjects = [
  {
    title: "Four Seasons Hotel Cairo",
    description: "Complete marble installation for luxury hotel lobby and suites",
    images: ["/luxury-hotel-lobby-marble-installation-four-season.jpg"],
    category: "Hospitality",
    location: "Cairo, Egypt",
  },
]

export function ProjectsSection() {
  const [projects, setProjects] = useState<any[]>(fallbackProjects)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      const result = await getActiveProjects()
      if (result.success && result.data.length > 0) {
        // Use database projects if available
        setProjects(result.data.slice(0, 2)) // Show first 2 projects
      } else {
        // Use fallback projects if DB not set up or no projects
        console.log("[v0] Using fallback projects - DB may not be set up yet")
        setProjects(fallbackProjects)
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
            <p className="text-xl text-gray-300">Loading projects...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
            Signature <span className="text-primary">Projects</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our portfolio of prestigious projects across the MENA region
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card
              key={project.id || index}
              className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 group min-h-[500px] flex flex-col"
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
                  <h3 className="font-serif text-2xl font-bold text-white mb-3 break-words line-clamp-2 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 mb-4 flex-1 break-words line-clamp-3">
                    {project.description}
                  </p>
                  <div className="mt-auto">
                    <a
                      href={`/projects/${project.slug || project.id}`}
                      className="inline-flex items-center px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 group-hover:shadow-lg"
                    >
                      View Project Details
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
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

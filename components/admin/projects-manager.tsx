"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { getProjects, createProject, updateProject, deleteProject } from "@/lib/actions/projects"

export function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft" | "archived">("all")

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      setError(null)
      const result = await getProjects()
      if (result.success) {
        setProjects(result.data)
      } else {
        setError(result.error || "Failed to fetch projects")
        console.error("[v0] Failed to fetch projects:", result.error)
      }
      setLoading(false)
    }
    fetchProjects()
  }, [])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || project.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleCreateProject = () => {
    const newProject = {
      title: "",
      category: "",
      location: "",
      year: new Date().getFullYear().toString(),
      client: "",
      slug: "",
      description: "",
      challenge: "",
      solution: "",
      results: [],
      materials: [],
      images: [],
      testimonial: {
        quote: "",
        author: "",
        position: "",
      },
      status: "draft",
      featured: false,
    }
    setSelectedProject(newProject)
    setIsEditing(true)
  }

  const handleSaveProject = async (project: any) => {
    try {
      if (project.id) {
        // Update existing project
        const result = await updateProject(project.id, project)
        if (result.success) {
          setProjects(projects.map((p) => (p.id === project.id ? result.data : p)))
        } else {
          alert(`Failed to update project: ${result.error}`)
          return
        }
      } else {
        // Create new project
        const result = await createProject(project)
        if (result.success) {
          setProjects([result.data, ...projects])
        } else {
          alert(`Failed to create project: ${result.error}`)
          return
        }
      }
      setSelectedProject(null)
      setIsEditing(false)
    } catch (err: any) {
      alert(`Error saving project: ${err.message}`)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const result = await deleteProject(projectId)
      if (result.success) {
        setProjects(projects.filter((p) => p.id !== projectId))
        if (selectedProject?.id === projectId) {
          setSelectedProject(null)
          setIsEditing(false)
        }
      } else {
        alert(`Failed to delete project: ${result.error}`)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400"
      case "draft":
        return "bg-yellow-500/20 text-yellow-400"
      case "archived":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-playfair text-3xl font-bold text-[#D4AF37]">Projects Manager</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-[#FAFAFA]/60 text-lg">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-playfair text-3xl font-bold text-[#D4AF37]">Projects Manager</h2>
          <Button onClick={handleCreateProject} className="bg-[#D4AF37] text-[#0F0F0F] hover:bg-[#C41E3A]">
            Add New Project
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-red-400 text-lg mb-4">Error: {error}</p>
          <p className="text-[#FAFAFA]/60 text-sm">
            The projects table may not exist yet. Please create it in your Supabase database.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-3xl font-bold text-[#D4AF37]">Projects Manager</h2>
        <Button onClick={handleCreateProject} className="bg-[#D4AF37] text-[#0F0F0F] hover:bg-[#C41E3A]">
          Add New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4">
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-[#0F0F0F] border border-[#D4AF37]/20 text-[#FAFAFA] rounded-md px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        <div className="text-[#FAFAFA]/60 flex items-center">{filteredProjects.length} projects found</div>
      </div>

      {/* Projects Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="border border-[#D4AF37]/20 rounded-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-playfair text-xl font-bold text-[#FAFAFA]">{project.title}</h3>
                  {project.featured && <Badge className="bg-[#D4AF37] text-[#0F0F0F] border-0 text-xs">Featured</Badge>}
                </div>

                <p className="text-[#FAFAFA]/60 text-sm mb-3 line-clamp-2">{project.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <Badge className={`${getStatusColor(project.status)} border-0`}>{project.status}</Badge>
                  <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-0">{project.category}</Badge>
                </div>

                <div className="text-xs text-[#FAFAFA]/40 space-y-1">
                  <p>Location: {project.location}</p>
                  <p>Year: {project.year}</p>
                  <p>Client: {project.client}</p>
                  <p>Updated: {project.updatedAt}</p>
                </div>
              </div>

              {project.images[0] && (
                <img
                  src={project.images[0] || "/placeholder.svg"}
                  alt={project.title}
                  className="w-20 h-16 object-cover rounded-lg ml-4"
                />
              )}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setSelectedProject(project)
                  setIsEditing(true)
                }}
                className="bg-[#D4AF37] text-[#0F0F0F] hover:bg-[#C41E3A] flex-1"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteProject(project.id)}
                className="border-red-500 text-red-400 hover:bg-red-500/20"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#FAFAFA]/60 text-lg">No projects found matching your criteria.</p>
        </div>
      )}

      {/* Project Editor Modal */}
      {isEditing && selectedProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-[#D4AF37]">
                {selectedProject.id ? "Edit Project" : "Create Project"}
              </h3>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedProject(null)
                  setIsEditing(false)
                }}
                className="border-[#D4AF37]/20 text-[#FAFAFA]"
              >
                Cancel
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Project Title</label>
                  <Input
                    value={selectedProject.title}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        title: e.target.value,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, ""),
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
                    placeholder="Enter project title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#D4AF37] font-semibold mb-2">Category</label>
                    <Input
                      value={selectedProject.category}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject,
                          category: e.target.value,
                        })
                      }
                      className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
                      placeholder="e.g., Luxury Hotel"
                    />
                  </div>

                  <div>
                    <label className="block text-[#D4AF37] font-semibold mb-2">Year</label>
                    <Input
                      value={selectedProject.year}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject,
                          year: e.target.value,
                        })
                      }
                      className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Location</label>
                  <Input
                    value={selectedProject.location}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        location: e.target.value,
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
                    placeholder="e.g., Cairo, Egypt"
                  />
                </div>

                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Client</label>
                  <Input
                    value={selectedProject.client}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        client: e.target.value,
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
                    placeholder="Client name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#D4AF37] font-semibold mb-2">Status</label>
                    <select
                      value={selectedProject.status}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject,
                          status: e.target.value as "active" | "draft" | "archived",
                        })
                      }
                      className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 text-[#FAFAFA] rounded-md px-3 py-2"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-8">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={selectedProject.featured}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject,
                          featured: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-[#D4AF37] font-semibold">
                      Featured Project
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Description</label>
                  <Textarea
                    value={selectedProject.description}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        description: e.target.value,
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA] min-h-[100px]"
                    placeholder="Project description"
                  />
                </div>

                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Challenge</label>
                  <Textarea
                    value={selectedProject.challenge}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        challenge: e.target.value,
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA] min-h-[80px]"
                    placeholder="Project challenges"
                  />
                </div>

                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Solution</label>
                  <Textarea
                    value={selectedProject.solution}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        solution: e.target.value,
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA] min-h-[80px]"
                    placeholder="How challenges were solved"
                  />
                </div>

                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Results (one per line)</label>
                  <Textarea
                    value={selectedProject.results.join("\n")}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        results: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA] min-h-[80px]"
                    placeholder="Project results and achievements"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-[#D4AF37] font-semibold mb-2">Materials Used (one per line)</label>
                <Textarea
                  value={selectedProject.materials.join("\n")}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject,
                      materials: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA] min-h-[100px]"
                  placeholder="Materials and quantities used"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Testimonial Quote</label>
                  <Textarea
                    value={selectedProject.testimonial.quote}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        testimonial: {
                          ...selectedProject.testimonial,
                          quote: e.target.value,
                        },
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA] min-h-[60px]"
                    placeholder="Client testimonial"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#D4AF37] font-semibold mb-2">Author</label>
                    <Input
                      value={selectedProject.testimonial.author}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject,
                          testimonial: {
                            ...selectedProject.testimonial,
                            author: e.target.value,
                          },
                        })
                      }
                      className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
                      placeholder="Author name"
                    />
                  </div>

                  <div>
                    <label className="block text-[#D4AF37] font-semibold mb-2">Position</label>
                    <Input
                      value={selectedProject.testimonial.position}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject,
                          testimonial: {
                            ...selectedProject.testimonial,
                            position: e.target.value,
                          },
                        })
                      }
                      className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
                      placeholder="Job title"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                onClick={() => handleSaveProject(selectedProject)}
                className="bg-[#D4AF37] text-[#0F0F0F] hover:bg-[#C41E3A]"
              >
                Save Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

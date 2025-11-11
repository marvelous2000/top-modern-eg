"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProjects, createProject, updateProject, deleteProject, type Project } from "@/lib/actions/projects"
import { useSupabaseClient } from "@/components/providers/SupabaseProvider"
import { Plus, Edit, Trash2, X, Save, Search, Loader2, Upload, Link as LinkIcon, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const supabase = useSupabaseClient({ optional: true })
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true); setError(null)
      try {
        const result = await getProjects()
        if (result.success) setProjects(result.data as Project[])
        else setError(result.error || "Failed to fetch projects")
      } catch (e: any) { setError(e.message) }
      finally { setLoading(false) }
    }
    fetchProjects()
  }, [])

  const filteredProjects = useMemo(() => {
    return projects.filter((p) =>
      (filterStatus === "all" || p.status === filterStatus) &&
      (p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [projects, searchTerm, filterStatus])

  const handleOpenForm = (project: Partial<Project> | null = null) => {
    if (project) {
      setEditingProject(project)
    } else {
      setEditingProject({ title: "", category: "", location: "", year: new Date().getFullYear().toString(), client: "", slug: "", description: "", challenge: "", solution: "", results: [], materials: [], images: [], testimonial: { quote: "", author: "", position: "" }, status: "draft", featured: false })
    }
    setIsFormOpen(true)
  }

  const handleSaveProject = async () => {
    if (!editingProject) return
    try {
      if (editingProject.id) {
        const result = await updateProject(editingProject.id, editingProject as Project)
        if (result.success) setProjects(projects.map((p) => (p.id === editingProject.id ? (result.data as Project) : p)))
        else throw new Error(result.error)
      } else {
        const result = await createProject(editingProject as Project)
        if (result.success) setProjects([result.data as Project, ...projects])
        else throw new Error(result.error)
      }
      setIsFormOpen(false)
      setEditingProject(null)
    } catch (err: any) { alert(`Error saving project: ${err.message}`) }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const result = await deleteProject(projectId)
      if (result.success) setProjects(projects.filter((p) => p.id !== projectId))
      else alert(`Failed to delete project: ${result.error}`)
    }
  }

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || !editingProject || !supabase) return;
    setUploading(true);
    const file = files[0];
    const safeSlug = (editingProject.slug || editingProject.title || "project").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const path = `projects/${safeSlug}/${file.name}`;
    const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file, { upsert: true });
    if (uploadError) {
      alert("Image upload failed: " + uploadError.message);
    } else {
      const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(path);
      setEditingProject({ ...editingProject, images: [...(editingProject.images || []), publicUrl] });
    }
    setUploading(false);
  };

  const statusConfig: { [key: string]: { color: string; textColor?: string } } = {
    active: { color: "bg-[hsl(var(--chart-2)_/_0.2)]", textColor: "hsl(var(--chart-2))" },
    draft: { color: "bg-[hsl(var(--chart-3)_/_0.2)]", textColor: "hsl(var(--chart-3))" },
    archived: { color: "bg-muted text-muted-foreground" },
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "'Segoe UI', sans-serif", animation: "slideIn 0.5s ease-out" }}>
      <Card className="shadow-sm border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-serif text-foreground">Projects</CardTitle>
            <p className="text-sm text-muted-foreground">Manage your portfolio of completed projects.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.body.classList.toggle('dark')}
              className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent hover:text-accent-foreground transition-all duration-200"
            >
              {document.body.classList.contains('dark') ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => handleOpenForm()}
              className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="relative sm:col-span-2 md:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground flex items-center justify-end">
            {filteredProjects.length} projects
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : error ? (
        <div className="h-64 flex flex-col items-center justify-center text-destructive bg-card border border-dashed rounded-lg">
          {error}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground bg-card border border-dashed rounded-lg">
          No projects found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:scale-[1.02] cursor-pointer overflow-hidden group"
              onClick={() => handleOpenForm(project)}
            >
              <CardHeader className="flex flex-row justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg break-words group-hover:text-accent transition-colors duration-200">
                    {project.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground capitalize">{project.category}</p>
                </div>
                {project.images?.[0] && (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-12 h-12 object-cover rounded-md border flex-shrink-0 shadow-sm"
                  />
                )}
              </CardHeader>
              <CardContent className="flex-grow flex flex-col p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-3 flex-grow break-words">
                  {project.description}
                </p>
                <div className="space-y-3 pt-4 mt-4 border-t border-border/50">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <Badge
                      className={cn("capitalize self-start", statusConfig[project.status]?.color)}
                      style={{ color: statusConfig[project.status]?.textColor }}
                    >
                      {project.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground break-words">Location: {project.location}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenForm(project)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1 hover:scale-105 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteProject(project.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-0 shadow-2xl" style={{ animation: "scaleIn 0.3s ease-out" }}>
          <DialogHeader className="p-6 border-b border-border/50 text-center bg-gradient-to-r from-accent/10 to-accent/5 flex-shrink-0">
            <DialogTitle className="text-2xl font-serif">
              {editingProject?.id ? (
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full shadow-sm">
                  Edit Project
                </span>
              ) : (
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full shadow-sm">
                  Create New Project
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Fill in the project details below, organized into sections.
            </DialogDescription>
          </DialogHeader>
          {editingProject && (
            <Tabs defaultValue="details" className="w-full flex-1 flex flex-col min-h-0">
              <div className="p-6 border-b border-border/50 flex-shrink-0">
                <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                  <TabsTrigger value="details" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="content" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200">
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="media" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200">
                    Media
                  </TabsTrigger>
                  <TabsTrigger value="testimonial" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200">
                    Testimonial
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="p-6 flex-1 overflow-y-auto min-h-0">
                <TabsContent value="details" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">Project Title *</Label>
                      <Input
                        value={editingProject.title}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            title: e.target.value,
                            slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                          })
                        }
                        className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                        placeholder="Enter project title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">Slug</Label>
                      <Input
                        value={editingProject.slug}
                        onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                        className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                        placeholder="URL-friendly slug"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">Category</Label>
                      <Input
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                        className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                        placeholder="e.g., Residential, Commercial"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">Year</Label>
                      <Input
                        type="number"
                        value={editingProject.year}
                        onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                        className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                        placeholder="Completion year"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">Location</Label>
                      <Input
                        value={editingProject.location}
                        onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                        className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                        placeholder="Project location"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">Client</Label>
                      <Input
                        value={editingProject.client}
                        onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                        className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                        placeholder="Client name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">Status *</Label>
                      <Select
                        value={editingProject.status}
                        onValueChange={(v) => setEditingProject({ ...editingProject, status: v as any })}
                      >
                        <SelectTrigger className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center pt-6 gap-2">
                      <Checkbox
                        id="featured"
                        checked={editingProject.featured}
                        onCheckedChange={(c) => setEditingProject({ ...editingProject, featured: !!c })}
                        className="border-border/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                      />
                      <Label htmlFor="featured" className="text-sm font-semibold text-foreground">
                        Featured Project
                      </Label>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="content" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Description *</Label>
                    <Textarea
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="min-h-[100px] bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 resize-none"
                      placeholder="Project description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Challenge</Label>
                    <Textarea
                      value={editingProject.challenge}
                      onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                      className="min-h-[80px] bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 resize-none"
                      placeholder="Project challenges"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Solution</Label>
                    <Textarea
                      value={editingProject.solution}
                      onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                      className="min-h-[80px] bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 resize-none"
                      placeholder="How challenges were solved"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="media" className="space-y-4 mt-0">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-foreground">Project Images</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!supabase || uploading}
                        className="hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? "Uploading..." : "Upload"}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {editingProject.images?.map((url, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          value={url}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              images: editingProject.images?.map((u, j) => (i === j ? e.target.value : u)),
                            })
                          }
                          className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setEditingProject({
                              ...editingProject,
                              images: editingProject.images?.filter((_, j) => i !== j),
                            })
                          }
                          className="hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setEditingProject({ ...editingProject, images: [...(editingProject.images || []), ""] })
                    }
                    className="hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image URL
                  </Button>
                </TabsContent>
                <TabsContent value="testimonial" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Quote</Label>
                    <Textarea
                      value={editingProject.testimonial?.quote || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          testimonial: { quote: e.target.value, author: editingProject.testimonial?.author || "", position: editingProject.testimonial?.position || "" },
                        })
                      }
                      className="min-h-[100px] bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 resize-none"
                      placeholder="Client testimonial quote"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">Author</Label>
                      <Input
                        value={editingProject.testimonial?.author || ""}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            testimonial: { quote: editingProject.testimonial?.quote || "", author: e.target.value, position: editingProject.testimonial?.position || "" },
                          })
                        }
                        className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                        placeholder="Testimonial author"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">Position</Label>
                      <Input
                        value={editingProject.testimonial?.position || ""}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            testimonial: { quote: editingProject.testimonial?.quote || "", author: editingProject.testimonial?.author || "", position: e.target.value },
                          })
                        }
                        className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                        placeholder="Author's position"
                      />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          )}
          <DialogFooter className="p-4 border-t border-border/50 bg-muted/20 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              className="hover:bg-muted transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProject}
              className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

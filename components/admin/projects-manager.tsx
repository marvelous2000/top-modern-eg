"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProjects, createProject, updateProject, deleteProject, type Project } from "@/lib/actions/projects"
import { Plus, Edit, Trash2, X, Save, Search, Loader2, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("en")

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getProjects()
        if (result.success) {
          setProjects(result.data as Project[])
        } else {
          setError(result.error || "Failed to fetch projects")
        }
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const filteredProjects = useMemo(() => {
    return projects.filter((p) =>
      (filterCategory === "all" || p.category === filterCategory) &&
      (filterStatus === "all" || p.status === filterStatus) &&
      (p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
       (p.title_ar && p.title_ar.toLowerCase().includes(searchTerm.toLowerCase())) ||
       (p.description_ar && p.description_ar.toLowerCase().includes(searchTerm.toLowerCase())))
    )
  }, [projects, searchTerm, filterCategory, filterStatus])

  const handleOpenForm = (project: Partial<Project> | null = null) => {
    if (project) {
      setEditingProject(project)
    } else {
      setEditingProject({
        title: "",
        title_ar: "",
        category: "residential",
        slug: "",
        description: "",
        description_ar: "",
        location: "",
        location_ar: "",
        client: "",
        client_ar: "",
        year: String(new Date().getFullYear()),
        images: [],
        status: "draft",
      })
    }
    setActiveTab("en")
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
    } catch (err: any) {
      alert(`Error saving project: ${err.message}`)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const result = await deleteProject(projectId)
      if (result.success) setProjects(projects.filter((p) => p.id !== projectId))
      else alert(`Failed to delete project: ${result.error}`)
    }
  }

  const statusConfig: { [key: string]: string } = {
    active: "bg-green-500/20 text-green-500",
    draft: "bg-orange-500/20 text-orange-500",
    archived: "bg-gray-500/20 text-gray-500",
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div><CardTitle className="text-2xl font-bold">Projects</CardTitle><p className="text-sm text-muted-foreground">Manage your portfolio of completed projects.</p></div>
          <Button onClick={() => handleOpenForm()} className="rounded-lg transition-transform duration-200 hover:-translate-y-0.5"><Plus className="h-4 w-4 mr-2" />Add Project</Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative sm:col-span-2 md:col-span-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 rounded-lg w-full" /></div>
          <Select value={filterCategory} onValueChange={setFilterCategory}><SelectTrigger className="rounded-lg"><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="all">All Categories</SelectItem><SelectItem value="residential">Residential</SelectItem><SelectItem value="commercial">Commercial</SelectItem></SelectContent></Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="rounded-lg"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
          <div className="text-sm text-muted-foreground flex items-center justify-end">{filteredProjects.length} projects</div>
        </CardContent>
      </Card>

      {loading ? <div className="h-64 flex items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div> :
       error ? <div className="h-64 flex flex-col items-center justify-center text-destructive bg-destructive/10 border border-dashed border-destructive rounded-lg p-4 text-center">{error}</div> :
       filteredProjects.length === 0 ? <div className="h-64 flex items-center justify-center text-muted-foreground bg-card border border-dashed rounded-lg">No projects found.</div> :
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl flex flex-col">
            <CardHeader className="flex flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="text-lg truncate group-hover:text-gold-600">{project.title}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">{project.category}</p>
              </div>
              {project.images?.[0] && <img src={project.images[0]} alt={project.title} className="w-16 h-16 object-cover rounded-lg border" />}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{project.description}</p>
              <div className="space-y-3 pt-4 mt-4 border-t">
                <div className="flex justify-between items-center">
                  <Badge className={cn("capitalize text-xs rounded-md", statusConfig[project.status])}>{project.status}</Badge>
                  <p className="text-xs text-muted-foreground">Location: {project.location}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="w-full rounded-md" onClick={() => handleOpenForm(project)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
                  <Button size="sm" variant="destructive" className="w-full rounded-md" onClick={() => handleDeleteProject(project.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg p-0 rounded-xl animate-fade-in-slide-down">
          <DialogHeader className="p-6 bg-accent text-accent-foreground text-center relative rounded-t-xl">
            <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Briefcase className="w-6 h-6" />
                </div>
                <div>
                    <DialogTitle className="text-2xl font-bold">{editingProject?.id ? "Edit Project" : "Create New Project"}</DialogTitle>
                    <DialogDescription className="text-accent-foreground/80">Fill in the details of the project below.</DialogDescription>
                </div>
            </div>
            <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          {editingProject && <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6 pt-0">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">Arabic</TabsTrigger>
              </TabsList>
              <TabsContent value="en">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="space-y-2"><Label className="font-semibold">Project Title (English)</Label><Input className="rounded-lg p-3" value={editingProject.title} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} /></div>
                  <div className="space-y-2"><Label className="font-semibold">Description (English)</Label><Textarea value={editingProject.description} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} className="min-h-[120px] rounded-lg p-3" /></div>
                  <div className="space-y-2"><Label className="font-semibold">Location (English)</Label><Input className="rounded-lg p-3" value={editingProject.location} onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })} /></div>
                </div>
              </TabsContent>
              <TabsContent value="ar">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2" dir="rtl">
                  <div className="space-y-2"><Label className="font-semibold">عنوان المشروع (العربية)</Label><Input className="rounded-lg p-3 text-right" value={(editingProject as any).title_ar || ""} onChange={(e) => setEditingProject({ ...editingProject, title_ar: e.target.value } as any)} /></div>
                  <div className="space-y-2"><Label className="font-semibold">الوصف (العربية)</Label><Textarea value={(editingProject as any).description_ar || ""} onChange={(e) => setEditingProject({ ...editingProject, description_ar: e.target.value } as any)} className="min-h-[120px] rounded-lg p-3 text-right" /></div>
                  <div className="space-y-2"><Label className="font-semibold">الموقع (العربية)</Label><Input className="rounded-lg p-3 text-right" value={(editingProject as any).location_ar || ""} onChange={(e) => setEditingProject({ ...editingProject, location_ar: e.target.value } as any)} /></div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6 border-t">
                <div className="space-y-2"><Label className="font-semibold">Category</Label><Select value={editingProject.category} onValueChange={(v) => setEditingProject({ ...editingProject, category: v as any })}><SelectTrigger className="rounded-lg p-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="residential">Residential</SelectItem><SelectItem value="commercial">Commercial</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label className="font-semibold">Status</Label><Select value={editingProject.status} onValueChange={(v) => setEditingProject({ ...editingProject, status: v as any })}><SelectTrigger className="rounded-lg p-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></div>
            </div>

            <DialogFooter className="flex justify-end space-x-3 p-4 bg-muted/30 border-t rounded-b-xl">
                <Button variant="outline" className="rounded-lg" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button className="rounded-lg transition-transform duration-200 hover:-translate-y-0.5" onClick={handleSaveProject}><Save className="h-4 w-4 mr-2" />Save Project</Button>
            </DialogFooter>
          </>}
        </DialogContent>
      </Dialog>
    </div>
  )
}
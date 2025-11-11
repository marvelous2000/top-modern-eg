"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { getProjects, createProject, updateProject, deleteProject, type Project } from "@/lib/actions/projects"
import { useSupabaseClient } from "@/components/providers/SupabaseProvider"
import { Plus, Edit, Trash2, X, Save, Search, Loader2, Upload, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

const FormSection = ({ title, description, children }: { title: string, description?: string, children: React.ReactNode }) => (
  <Card className="p-4">
    <CardHeader className="p-2">
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </CardHeader>
    <CardContent className="p-2 space-y-4">
      {children}
    </CardContent>
  </Card>
);

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
      (p.title.toLowerCase().includes(searchTerm.toLowerCase()) || (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())))
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
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative sm:col-span-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 rounded-lg w-full" /></div>
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
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg break-words group-hover:text-accent">{project.title}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">{project.category}</p>
              </div>
              {project.images?.[0] && <img src={project.images[0]} alt={project.title} className="w-16 h-16 object-cover rounded-lg border flex-shrink-0" />}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <p className="text-sm text-muted-foreground line-clamp-3 flex-grow break-words">{project.description}</p>
              <div className="space-y-3 pt-4 mt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <Badge className={cn("capitalize self-start text-xs rounded-md", statusConfig[project.status])}>{project.status}</Badge>
                  <p className="text-xs text-muted-foreground break-words">Location: {project.location}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 rounded-md" onClick={() => handleOpenForm(project)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
                  <Button size="sm" variant="destructive" className="flex-1 rounded-md" onClick={() => handleDeleteProject(project.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl p-0 rounded-xl animate-fade-in-slide-down">
          <DialogHeader className="p-6 bg-accent text-accent-foreground text-center relative rounded-t-xl">
            <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Briefcase className="w-6 h-6" />
                </div>
                <div>
                    <DialogTitle className="text-2xl font-bold">{editingProject?.id ? "Edit Project" : "Create New Project"}</DialogTitle>
                    <DialogDescription className="text-accent-foreground/80">Fill in the project details below.</DialogDescription>
                </div>
            </div>
            <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          {editingProject && <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
            <FormSection title="Core Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="font-semibold">Project Title</Label><Input className="rounded-lg" value={editingProject.title} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} /></div>
                <div className="space-y-2"><Label className="font-semibold">Slug</Label><Input className="rounded-lg" value={editingProject.slug} onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })} /></div>
                <div className="space-y-2"><Label className="font-semibold">Category</Label><Input className="rounded-lg" value={editingProject.category} onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })} /></div>
                <div className="space-y-2"><Label className="font-semibold">Year</Label><Input className="rounded-lg" type="number" value={editingProject.year} onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })} /></div>
                <div className="space-y-2"><Label className="font-semibold">Location</Label><Input className="rounded-lg" value={editingProject.location} onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })} /></div>
                <div className="space-y-2"><Label className="font-semibold">Client</Label><Input className="rounded-lg" value={editingProject.client} onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })} /></div>
                <div className="space-y-2"><Label className="font-semibold">Status</Label><Select value={editingProject.status} onValueChange={(v) => setEditingProject({ ...editingProject, status: v as any })}><SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></div>
                <div className="flex items-center pt-6 gap-2"><Checkbox id="featured" checked={editingProject.featured} onCheckedChange={(c) => setEditingProject({ ...editingProject, featured: !!c })} /><Label htmlFor="featured" className="font-semibold">Featured Project</Label></div>
              </div>
            </FormSection>
            <FormSection title="Project Content">
              <div className="space-y-4">
                <div className="space-y-2"><Label className="font-semibold">Description</Label><Textarea value={editingProject.description} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} className="min-h-[100px] rounded-lg" /></div>
                <div className="space-y-2"><Label className="font-semibold">Challenge</Label><Textarea value={editingProject.challenge} onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })} className="min-h-[80px] rounded-lg" /></div>
                <div className="space-y-2"><Label className="font-semibold">Solution</Label><Textarea value={editingProject.solution} onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })} className="min-h-[80px] rounded-lg" /></div>
              </div>
            </FormSection>
            <FormSection title="Media" description="Upload project images.">
              <div className="space-y-4">
                <Button variant="outline" className="w-full rounded-lg" onClick={() => fileInputRef.current?.click()} disabled={!supabase || uploading}><Upload className="h-4 w-4 mr-2" />{uploading ? "Uploading..." : "Upload Image"}</Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files)} />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {editingProject.images?.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt={`Project image ${i+1}`} className="w-full h-24 object-cover rounded-lg border" />
                      <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setEditingProject({ ...editingProject, images: editingProject.images?.filter((_, j) => i !== j) })}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </div>
            </FormSection>
            <FormSection title="Testimonial">
              <div className="space-y-4">
                <div className="space-y-2"><Label className="font-semibold">Quote</Label><Textarea value={editingProject.testimonial?.quote || ""} onChange={(e) => setEditingProject({ ...editingProject, testimonial: { ...editingProject.testimonial, quote: e.target.value } })} className="min-h-[100px] rounded-lg" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="font-semibold">Author</Label><Input className="rounded-lg" value={editingProject.testimonial?.author || ""} onChange={(e) => setEditingProject({ ...editingProject, testimonial: { ...editingProject.testimonial, author: e.target.value } })} /></div>
                  <div className="space-y-2"><Label className="font-semibold">Position</Label><Input className="rounded-lg" value={editingProject.testimonial?.position || ""} onChange={(e) => setEditingProject({ ...editingProject, testimonial: { ...editingProject.testimonial, position: e.target.value } })} /></div>
                </div>
              </div>
            </FormSection>
          </div>}
          <DialogFooter className="flex justify-end space-x-3 p-4 bg-muted/30 border-t rounded-b-xl">
            <Button variant="outline" className="rounded-lg" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button className="rounded-lg transition-transform duration-200 hover:-translate-y-0.5" onClick={handleSaveProject}><Save className="h-4 w-4 mr-2" />Save Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

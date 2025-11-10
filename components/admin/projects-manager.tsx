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
import { Plus, Edit, Trash2, X, Save, Search, Loader2, Upload, Link as LinkIcon } from "lucide-react"
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
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div><CardTitle className="text-2xl font-serif text-foreground">Projects</CardTitle><p className="text-sm text-muted-foreground">Manage your portfolio of completed projects.</p></div>
          <Button onClick={() => handleOpenForm()}><Plus className="h-4 w-4 mr-2" />Add Project</Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="relative sm:col-span-2 md:col-span-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-muted/50 w-full" /></div>
          <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
          <div className="text-sm text-muted-foreground flex items-center justify-end">{filteredProjects.length} projects</div>
        </CardContent>
      </Card>

      {loading ? <div className="h-64 flex items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div> :
       error ? <div className="h-64 flex flex-col items-center justify-center text-destructive bg-card border border-dashed rounded-lg">{error}</div> :
       filteredProjects.length === 0 ? <div className="h-64 flex items-center justify-center text-muted-foreground bg-card border border-dashed rounded-lg">No projects found.</div> :
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <CardHeader className="flex flex-row justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg break-words">{project.title}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">{project.category}</p>
              </div>
              {project.images?.[0] && <img src={project.images[0]} alt={project.title} className="w-12 h-12 object-cover rounded-md border flex-shrink-0" />}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <p className="text-sm text-muted-foreground line-clamp-3 flex-grow break-words">{project.description}</p>
              <div className="space-y-3 pt-4 mt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <Badge className={cn("capitalize self-start", statusConfig[project.status]?.color)} style={{ color: statusConfig[project.status]?.textColor }}>{project.status}</Badge>
                  <p className="text-xs text-muted-foreground break-words">Location: {project.location}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleOpenForm(project)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDeleteProject(project.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
          <DialogHeader className="p-6 border-b text-center flex-shrink-0">
            <DialogTitle className="text-2xl font-serif">
              {editingProject?.id ? <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md">Edit Project</span> : <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md">Create New Project</span>}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Fill in the project details below, organized into sections.
            </DialogDescription>
          </DialogHeader>
          {editingProject && <Tabs defaultValue="details" className="w-full flex-1 flex flex-col min-h-0">
            <div className="p-6 border-b flex-shrink-0"><TabsList className="grid w-full grid-cols-4"><TabsTrigger value="details">Details</TabsTrigger><TabsTrigger value="content">Content</TabsTrigger><TabsTrigger value="media">Media</TabsTrigger><TabsTrigger value="testimonial">Testimonial</TabsTrigger></TabsList></div>
            <div className="p-6 flex-1 overflow-y-auto min-h-0">
              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label>Project Title</Label><Input value={editingProject.title} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} /></div><div className="space-y-2"><Label>Slug</Label><Input value={editingProject.slug} onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })} /></div></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label>Category</Label><Input value={editingProject.category} onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })} /></div><div className="space-y-2"><Label>Year</Label><Input type="number" value={editingProject.year} onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })} /></div></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label>Location</Label><Input value={editingProject.location} onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })} /></div><div className="space-y-2"><Label>Client</Label><Input value={editingProject.client} onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })} /></div></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label>Status</Label><Select value={editingProject.status} onValueChange={(v) => setEditingProject({ ...editingProject, status: v as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></div><div className="flex items-center pt-6 gap-2"><Checkbox id="featured" checked={editingProject.featured} onCheckedChange={(c) => setEditingProject({ ...editingProject, featured: !!c })} /><Label htmlFor="featured">Featured Project</Label></div></div>
              </TabsContent>
              <TabsContent value="content" className="space-y-4 mt-0"><div className="space-y-2"><Label>Description</Label><Textarea value={editingProject.description} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} className="min-h-[100px] resize-none" /></div><div className="space-y-2"><Label>Challenge</Label><Textarea value={editingProject.challenge} onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })} className="min-h-[80px] resize-none" /></div><div className="space-y-2"><Label>Solution</Label><Textarea value={editingProject.solution} onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })} className="min-h-[80px] resize-none" /></div></TabsContent>
              <TabsContent value="media" className="space-y-4"><div className="flex items-center justify-between"><Label>Project Images</Label><div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={!supabase || uploading}><Upload className="h-4 w-4 mr-2" />{uploading ? "Uploading..." : "Upload"}</Button><input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageUpload(e.target.files)} /></div></div><div className="space-y-2">{editingProject.images?.map((url, i) => <div key={i} className="flex items-center gap-2"><Input value={url} onChange={(e) => setEditingProject({ ...editingProject, images: editingProject.images?.map((u, j) => i === j ? e.target.value : u) })} /><Button variant="ghost" size="icon" onClick={() => setEditingProject({ ...editingProject, images: editingProject.images?.filter((_, j) => i !== j) })}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>)}</div><Button variant="secondary" size="sm" onClick={() => setEditingProject({ ...editingProject, images: [...(editingProject.images || []), ""] })}><Plus className="h-4 w-4 mr-2" />Add Image URL</Button></TabsContent>
              <TabsContent value="testimonial" className="space-y-4"><div className="space-y-2"><Label>Quote</Label><Textarea value={editingProject.testimonial?.quote || ""} onChange={(e) => setEditingProject({ ...editingProject, testimonial: { ...editingProject.testimonial, quote: e.target.value } })} className="min-h-[100px] resize-none" /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Author</Label><Input value={editingProject.testimonial?.author || ""} onChange={(e) => setEditingProject({ ...editingProject, testimonial: { ...editingProject.testimonial, author: e.target.value } })} /></div><div className="space-y-2"><Label>Position</Label><Input value={editingProject.testimonial?.position || ""} onChange={(e) => setEditingProject({ ...editingProject, testimonial: { ...editingProject.testimonial, position: e.target.value } })} /></div></div></TabsContent>
            </div>
          </Tabs>}
          <DialogFooter className="p-4 border-t flex-shrink-0"><Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button><Button onClick={handleSaveProject}><Save className="h-4 w-4 mr-2" />Save Project</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

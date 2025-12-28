"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProjects, createProject, updateProject, deleteProject, type Project } from "@/lib/actions/projects"
import { Plus, Edit, Trash2, X, Save, Search, Loader2, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageUpload } from "./ImageUpload"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [imageUploadLoading, setImageUploadLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
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
    return projects.filter((p) => {
      const searchTermLower = searchTerm.toLowerCase();
      const titleMatch = p.title.toLowerCase().includes(searchTermLower);
      const descriptionMatch = p.description && p.description.toLowerCase().includes(searchTermLower);
      const titleArMatch = p.title_ar && p.title_ar.toLowerCase().includes(searchTermLower);
      const descriptionArMatch = p.description_ar && p.description_ar.toLowerCase().includes(searchTermLower);
      
      return (filterStatus === "all" || p.status === filterStatus) &&
             (titleMatch || descriptionMatch || titleArMatch || descriptionArMatch);
    });
  }, [projects, searchTerm, filterStatus])

  const handleOpenForm = (project: Partial<Project> | null = null) => {
    setNewImageFiles([])
    if (project) {
      setEditingProject(project)
    } else {
      setEditingProject({ 
        title: "", title_ar: "", 
        category: "", category_ar: "", 
        location: "", location_ar: "", 
        year: new Date().getFullYear().toString(), 
        client: "", client_ar: "", 
        slug: "", 
        description: "", description_ar: "", 
        challenge: "", challenge_ar: "", 
        solution: "", solution_ar: "", 
        results: [], results_ar: [], 
        materials: [], materials_ar: [], 
        images: [], 
        testimonial: { quote: "", author: "", position: "" }, 
        testimonial_ar: { quote: "", author: "", position: "" }, 
        status: "draft", featured: false 
      })
    }
    setIsFormOpen(true)
  }

  const handleSaveProject = async () => {
    if (!editingProject) return;
    setImageUploadLoading(true);
    let imageUrlsToSave = editingProject.images ? [...editingProject.images] : [];
    const supabase = createSupabaseBrowserClient();

    try {
      if (newImageFiles.length > 0) {
        for (const file of newImageFiles) {
          const fileExtension = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
          const filePath = `project-images/${fileName}`;
          const { error: uploadError } = await supabase.storage.from("uploads").upload(filePath, file, { cacheControl: "3600", upsert: false });
        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
        const { data: publicUrlData } = supabase.storage.from("uploads").getPublicUrl(filePath);
          if (publicUrlData && publicUrlData.publicUrl) imageUrlsToSave.push(publicUrlData.publicUrl);
          else throw new Error(`Failed to get public URL for image: ${file.name}`);
        }
      }
      
      const projectToSave = { ...editingProject, images: imageUrlsToSave } as Project;
      const result = editingProject.id ? await updateProject(editingProject.id, projectToSave) : await createProject(projectToSave);

      if (result.success) {
        const updatedProjects = editingProject.id
          ? projects.map((p) => (p.id === editingProject.id ? (result.data as Project) : p))
          : [result.data as Project, ...projects];
        setProjects(updatedProjects);
        setIsFormOpen(false);
        setEditingProject(null);
        setNewImageFiles([]);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message)
      alert(`Error saving project: ${err.message}`)
    } finally {
      setImageUploadLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const result = await deleteProject(projectId)
      if (result.success) setProjects(projects.filter((p) => p.id !== projectId))
      else alert(`Failed to delete project: ${result.error}`)
    }
  }

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
            <Button variant="outline" size="sm" onClick={() => document.body.classList.toggle('dark')} className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent hover:text-gold-600 transition-all duration-200">
              {isClient && document.body.classList.contains('dark') ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button onClick={() => handleOpenForm()} className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"><Plus className="h-4 w-4 mr-2" />Add Project</Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="relative sm:col-span-2 md:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-12 pl-10 px-3 py-2 bg-background border border-border rounded-lg focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full h-12 bg-background border border-border rounded-lg focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground flex items-center justify-end">{filteredProjects.length} projects</div>
        </CardContent>
      </Card>

      {loading ? <div className="h-64 flex items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
       : error ? <div className="h-64 flex flex-col items-center justify-center text-destructive bg-card border border-dashed rounded-lg">{error}</div>
       : filteredProjects.length === 0 ? <div className="h-64 flex items-center justify-center text-muted-foreground bg-card border border-dashed rounded-lg">No projects found.</div>
       : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:scale-[1.02] cursor-pointer overflow-hidden group" onClick={() => handleOpenForm(project)}>
              <CardHeader className="flex flex-row justify-between items-start gap-4 p-4">
                <div className="flex-1 min-w-0"><CardTitle className="text-lg break-words group-hover:text-accent transition-colors duration-200">{project.title}</CardTitle><p className="text-sm text-muted-foreground capitalize">{project.category}</p></div>
                {project.images?.[0] && <img src={project.images[0]} alt={project.title} className="w-12 h-12 object-cover rounded-md border flex-shrink-0 shadow-sm" />}
              </CardHeader>
              <CardContent className="flex-grow flex flex-col p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-3 flex-grow break-words">{project.description}</p>
                <div className="space-y-3 pt-4 mt-4 border-t border-border/50">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"><Badge className={cn("capitalize self-start", statusConfig[project.status]?.color)} style={{ color: statusConfig[project.status]?.textColor }}>{project.status}</Badge><p className="text-xs text-muted-foreground break-words">Location: {project.location}</p></div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2"><Button size="sm" variant="outline" className="flex-1 hover:bg-accent hover:text-gold-600 transition-all duration-200" onClick={(e) => { e.stopPropagation(); handleOpenForm(project) }}><Edit className="h-4 w-4 mr-2" />Edit</Button><Button size="sm" variant="destructive" className="flex-1 hover:scale-105 transition-all duration-200" onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id)}}><Trash2 className="h-4 w-4 mr-2" />Delete</Button></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-primary">{editingProject?.id ? "Edit Project" : "Create New Project"}</h3>
              <Button variant="outline" onClick={() => setIsFormOpen(false)} className="hover:bg-muted transition-all duration-200"><X className="h-4 w-4 mr-2" />Cancel</Button>
            </div>
            {editingProject && (
              <form onSubmit={(e) => { e.preventDefault(); handleSaveProject(); }} className="space-y-6">
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="ar">Arabic</TabsTrigger></TabsList>
                  <TabsContent value="en" className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label className="font-semibold">Project Title *</Label><Input value={editingProject.title} onChange={(e) => setEditingProject({...editingProject, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")})} className="bg-background border-border/50" placeholder="Enter project title" required/></div><div className="space-y-2"><Label className="font-semibold">Category</Label><Input value={editingProject.category} onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })} className="bg-background border-border/50" placeholder="e.g., Residential, Commercial"/></div></div>
                      <div className="space-y-2"><Label className="font-semibold">Description *</Label><Textarea value={editingProject.description} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} className="min-h-[100px] bg-background border-border/50 resize-none" placeholder="Project description" required/></div>
                      <div className="space-y-2"><Label className="font-semibold">Challenge</Label><Textarea value={editingProject.challenge} onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })} className="min-h-[80px] bg-background border-border/50 resize-none" placeholder="Project challenges"/></div>
                      <div className="space-y-2"><Label className="font-semibold">Solution</Label><Textarea value={editingProject.solution} onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })} className="min-h-[80px] bg-background border-border/50 resize-none" placeholder="How challenges were solved"/></div>
                      <div className="space-y-2"><Label className="font-semibold">Testimonial Quote</Label><Textarea value={editingProject.testimonial?.quote || ""} onChange={(e) => setEditingProject({...editingProject, testimonial: { ...editingProject.testimonial!, quote: e.target.value }})} className="min-h-[100px] bg-background border-border/50 resize-none" placeholder="Client testimonial quote"/></div>
                      <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label className="font-semibold">Testimonial Author</Label><Input value={editingProject.testimonial?.author || ""} onChange={(e) => setEditingProject({...editingProject, testimonial: { ...editingProject.testimonial!, author: e.target.value }})} className="bg-background border-border/50" placeholder="Testimonial author"/></div><div className="space-y-2"><Label className="font-semibold">Author's Position</Label><Input value={editingProject.testimonial?.position || ""} onChange={(e) => setEditingProject({...editingProject, testimonial: { ...editingProject.testimonial!, position: e.target.value }})} className="bg-background border-border/50" placeholder="Author's position"/></div></div>
                    </div>
                  </TabsContent>
                  <TabsContent value="ar" className="pt-6">
                    <div className="space-y-4" dir="rtl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label className="font-semibold">اسم المشروع *</Label><Input value={editingProject.title_ar} onChange={(e) => setEditingProject({...editingProject, title_ar: e.target.value })} className="bg-background border-border/50" placeholder="أدخل اسم المشروع" /></div><div className="space-y-2"><Label className="font-semibold">فئة</Label><Input value={editingProject.category_ar} onChange={(e) => setEditingProject({ ...editingProject, category_ar: e.target.value })} className="bg-background border-border/50" placeholder="مثال: سكني، تجاري"/></div></div>
                      <div className="space-y-2"><Label className="font-semibold">الوصف *</Label><Textarea value={editingProject.description_ar} onChange={(e) => setEditingProject({ ...editingProject, description_ar: e.target.value })} className="min-h-[100px] bg-background border-border/50 resize-none" placeholder="وصف المشروع"/></div>
                      <div className="space-y-2"><Label className="font-semibold">التحدي</Label><Textarea value={editingProject.challenge_ar} onChange={(e) => setEditingProject({ ...editingProject, challenge_ar: e.target.value })} className="min-h-[80px] bg-background border-border/50 resize-none" placeholder="تحديات المشروع"/></div>
                      <div className="space-y-2"><Label className="font-semibold">الحل</Label><Textarea value={editingProject.solution_ar} onChange={(e) => setEditingProject({ ...editingProject, solution_ar: e.target.value })} className="min-h-[80px] bg-background border-border/50 resize-none" placeholder="كيف تم حل التحديات"/></div>
                      <div className="space-y-2"><Label className="font-semibold">اقتباس شهادة</Label><Textarea value={editingProject.testimonial_ar?.quote || ""} onChange={(e) => setEditingProject({...editingProject, testimonial_ar: { ...editingProject.testimonial_ar!, quote: e.target.value }})} className="min-h-[100px] bg-background border-border/50 resize-none" placeholder="اقتباس شهادة العميل"/></div>
                      <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label className="font-semibold">صاحب الشهادة</Label><Input value={editingProject.testimonial_ar?.author || ""} onChange={(e) => setEditingProject({...editingProject, testimonial_ar: { ...editingProject.testimonial_ar!, author: e.target.value }})} className="bg-background border-border/50" placeholder="صاحب الشهادة"/></div><div className="space-y-2"><Label className="font-semibold">منصب صاحب الشهادة</Label><Input value={editingProject.testimonial_ar?.position || ""} onChange={(e) => setEditingProject({...editingProject, testimonial_ar: { ...editingProject.testimonial_ar!, position: e.target.value }})} className="bg-background border-border/50" placeholder="منصب صاحب الشهادة"/></div></div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
                  <div className="space-y-4"><Label className="font-semibold">Slug (URL)</Label><Input value={editingProject.slug} onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })} className="bg-background border-border/50" placeholder="Unique URL-friendly-slug"/></div>
                  <div className="space-y-4"><Label className="font-semibold">Year</Label><Input type="number" value={editingProject.year} onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })} className="bg-background border-border/50" placeholder="Completion year"/></div>
                  <div className="space-y-4"><Label className="font-semibold">Status *</Label><Select value={editingProject.status} onValueChange={(v) => setEditingProject({ ...editingProject, status: v as any })}><SelectTrigger className="bg-background border-border/50"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></div>
                  <div className="flex items-center pt-6 gap-2"><Checkbox id="featured" checked={editingProject.featured} onCheckedChange={(c) => setEditingProject({ ...editingProject, featured: !!c })} className="border-border/50"/><Label htmlFor="featured" className="font-semibold">Featured Project</Label></div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <Label className="block text-primary font-semibold mb-4">Images</Label>
                  <ImageUpload initialImages={editingProject.images} onImagesChange={(newFiles, updatedExistingUrls) => { setNewImageFiles(newFiles); setEditingProject((prev) => ({ ...prev!, images: updatedExistingUrls, })); }} disabled={imageUploadLoading}/>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl" disabled={imageUploadLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {imageUploadLoading ? "Saving..." : "Save Project"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
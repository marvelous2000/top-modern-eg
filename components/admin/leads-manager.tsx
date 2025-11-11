"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useSupabaseClient } from "@/components/providers/SupabaseProvider"
import { Loader2, Search, Inbox, Send, CheckCircle, Archive, Mail, Phone, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type RawSubmission = { id: number; form_type: string | null; form_data: Record<string, any> | null; status: string | null; created_at: string | null; processed_at?: string | null }
type Lead = { id: number; name: string; email: string; phone: string; formType: string; status: string; createdAt: string; rawData: Record<string, any> }
function resolveField<T extends string | undefined>(value: any, fallback: T): T | string { if (typeof value === "string" && value.trim().length > 0) { return value.trim() } if (typeof value === "number") { return value.toString() } return fallback }
function mapSubmissionToLead(submission: RawSubmission): Lead { const data = submission.form_data ?? {}; const name = resolveField(data.name, undefined) ?? resolveField(data.full_name, undefined) ?? resolveField(data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined, "Unknown"); const email = resolveField(data.email, undefined) ?? resolveField(data.emailAddress, undefined) ?? resolveField(data.contact_email, "Not provided"); const phone = resolveField(data.phone, undefined) ?? resolveField(data.phoneNumber, undefined) ?? resolveField(data.contact_phone, "Not provided"); return { id: submission.id, name, email, phone, formType: submission.form_type ?? "unknown", status: submission.status ?? "new", createdAt: submission.created_at ?? new Date().toISOString(), rawData: data, } }
function mapLocalSubmissionToLead(entry: any, index: number): Lead { const timestamp = typeof entry?.timestamp === "string" ? entry.timestamp : new Date().toISOString(); const formData = entry?.formData ?? {}; const name = resolveField(formData.name, undefined) ?? resolveField(formData.firstName || formData.lastName ? `${formData.firstName ?? ""} ${formData.lastName ?? ""}`.trim() : undefined, "Unknown"); const email = resolveField(formData.email, undefined) ?? resolveField(formData.emailAddress, undefined) ?? "Not provided"; const phone = resolveField(formData.phone, undefined) ?? resolveField(formData.phoneNumber, undefined) ?? "Not provided"; return { id: Date.parse(timestamp) || index + 1, name, email, phone, formType: entry?.formType ?? "unknown", status: "new", createdAt: timestamp, rawData: formData, } }

const InfoField = ({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Icon className="h-4 w-4" /><span>{label}</span></div>
    <div className="text-sm text-foreground font-semibold pl-6 break-all">{children}</div>
  </div>
)

export function LeadsManager() {
  const supabase = useSupabaseClient({ optional: true })
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const loadData = () => {
      const localData = JSON.parse(localStorage.getItem("formSubmissions") || "[]")
      if (Array.isArray(localData) && localData.length > 0) {
        setLeads(localData.map(mapLocalSubmissionToLead).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)))
      }
    }
    if (!supabase) { loadData(); setLoading(false) }
  }, [supabase])

  useEffect(() => {
    if (!supabase) return
    let isMounted = true
    const fetchLeads = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("form_submissions").select("*").order("created_at", { ascending: false }).limit(200)
      if (!isMounted) return
      if (error) { console.error("Failed to load leads:", error); setLeads([]) } 
      else { setLeads((data ?? []).map(mapSubmissionToLead)) }
      setLoading(false)
    }
    fetchLeads()
    return () => { isMounted = false }
  }, [supabase])

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => 
      (filterStatus === "all" || lead.status === filterStatus) &&
      (JSON.stringify(lead).toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [leads, searchTerm, filterStatus])

  const handleStatusChange = (leadId: number, newStatus: string) => {
    setLeads(leads.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead)))
    if (selectedLead && selectedLead.id === leadId) setSelectedLead({ ...selectedLead, status: newStatus })
    if (supabase) { /* TODO: Persist status change to Supabase */ }
  }

  const statusConfig: { [key: string]: string } = {
    new: "bg-blue-500/20 text-blue-500",
    contacted: "bg-orange-500/20 text-orange-500",
    qualified: "bg-green-500/20 text-green-500",
    archived: "bg-gray-500/20 text-gray-500",
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div><CardTitle className="text-2xl font-bold">Leads Manager</CardTitle><p className="text-sm text-muted-foreground">View and manage all incoming leads.</p></div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search leads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 rounded-lg w-full" /></div>
            <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="rounded-lg w-full sm:w-48"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="new">New</SelectItem><SelectItem value="contacted">Contacted</SelectItem><SelectItem value="qualified">Qualified</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : filteredLeads.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground bg-card border border-dashed rounded-lg">No leads found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} onClick={() => setSelectedLead(lead)} className="cursor-pointer overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl">
              <CardHeader className="p-4">
                <CardTitle className="text-lg truncate group-hover:text-accent">{lead.name}</CardTitle>
                <p className="text-sm text-muted-foreground truncate">{lead.email}</p>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between items-center mt-2">
                  <Badge className={cn("capitalize text-xs rounded-md", statusConfig[lead.status])}>{lead.status}</Badge>
                  <p className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={Boolean(selectedLead)} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-lg p-0 rounded-xl animate-fade-in-slide-down">
          <DialogHeader className="p-6 bg-accent text-accent-foreground text-center relative rounded-t-xl">
            <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"><Inbox className="w-6 h-6" /></div>
                <div>
                    <DialogTitle className="text-2xl font-bold">{selectedLead?.name}</DialogTitle>
                    <DialogDescription className="text-accent-foreground/80">From '{selectedLead?.formType.replace(/_/g, " ")}' &middot; {selectedLead ? new Date(selectedLead.createdAt).toLocaleString() : ""}</DialogDescription>
                </div>
            </div>
            <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"><X className="h-6 w-6" /><span className="sr-only">Close</span></DialogClose>
          </DialogHeader>
          {selectedLead && (
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <InfoField label="Email" icon={Mail}><a href={`mailto:${selectedLead.email}`} className="hover:underline">{selectedLead.email}</a></InfoField>
                <InfoField label="Phone" icon={Phone}><a href={`tel:${selectedLead.phone}`} className="hover:underline">{selectedLead.phone}</a></InfoField>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Full Form Details</h3>
                <div className="p-4 border rounded-lg space-y-3 max-h-48 overflow-y-auto bg-muted/20">
                  {Object.keys(selectedLead.rawData).length > 0 ? Object.entries(selectedLead.rawData).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-2 text-sm"><span className="col-span-1 font-medium text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span><span className="col-span-2 text-foreground break-words">{String(value) || <span className="text-muted-foreground/60">empty</span>}</span></div>
                  )) : <p className="text-sm text-muted-foreground text-center">No additional data submitted.</p>}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Update Status</h3>
                <Select value={selectedLead.status} onValueChange={(newStatus) => handleStatusChange(selectedLead.id, newStatus)}>
                  <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(statusConfig).map(status => <SelectItem key={status} value={status}><span className="capitalize">{status}</span></SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

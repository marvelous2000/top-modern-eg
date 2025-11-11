"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useSupabaseClient } from "@/components/providers/SupabaseProvider"
import { Loader2, Search, Inbox, Send, CheckCircle, Archive, Mail, Phone } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

// Types and utility functions (mapSubmissionToLead, etc.) remain the same
type RawSubmission = { id: number; form_type: string | null; form_data: Record<string, any> | null; status: string | null; created_at: string | null; processed_at?: string | null }
type Lead = { id: number; name: string; email: string; phone: string; formType: string; status: string; createdAt: string; rawData: Record<string, any> }
function resolveField<T extends string | undefined>(value: any, fallback: T): T | string { if (typeof value === "string" && value.trim().length > 0) { return value.trim() } if (typeof value === "number") { return value.toString() } return fallback }
function mapSubmissionToLead(submission: RawSubmission): Lead { const data = submission.form_data ?? {}; const name = resolveField(data.name, undefined) ?? resolveField(data.full_name, undefined) ?? resolveField(data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined, "Unknown"); const email = resolveField(data.email, undefined) ?? resolveField(data.emailAddress, undefined) ?? resolveField(data.contact_email, "Not provided"); const phone = resolveField(data.phone, undefined) ?? resolveField(data.phoneNumber, undefined) ?? resolveField(data.contact_phone, "Not provided"); return { id: submission.id, name, email, phone, formType: submission.form_type ?? "unknown", status: submission.status ?? "new", createdAt: submission.created_at ?? new Date().toISOString(), rawData: data, } }
function mapLocalSubmissionToLead(entry: any, index: number): Lead { const timestamp = typeof entry?.timestamp === "string" ? entry.timestamp : new Date().toISOString(); const formData = entry?.formData ?? {}; const name = resolveField(formData.name, undefined) ?? resolveField(formData.firstName || formData.lastName ? `${formData.firstName ?? ""} ${formData.lastName ?? ""}`.trim() : undefined, "Unknown"); const email = resolveField(formData.email, undefined) ?? resolveField(formData.emailAddress, undefined) ?? "Not provided"; const phone = resolveField(formData.phone, undefined) ?? resolveField(formData.phoneNumber, undefined) ?? "Not provided"; return { id: Date.parse(timestamp) || index + 1, name, email, phone, formType: entry?.formType ?? "unknown", status: "new", createdAt: timestamp, rawData: formData, } }

const InfoField = ({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <div className="text-sm text-foreground font-semibold pl-6">{children}</div>
  </div>
)

export function LeadsManager() {
  const supabase = useSupabaseClient({ optional: true })
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedStatus, setSelectedStatus] = useState("new")

  useEffect(() => {
    const loadData = () => {
      const localData = JSON.parse(localStorage.getItem("formSubmissions") || "[]")
      if (Array.isArray(localData) && localData.length > 0) {
        setLeads(localData.map(mapLocalSubmissionToLead).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)))
      }
    }
    if (!supabase) {
      loadData()
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    if (!supabase) return
    let isMounted = true
    const fetchLeads = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("form_submissions").select("*").order("created_at", { ascending: false }).limit(200)
      if (!isMounted) return
      if (error) {
        console.error("Failed to load leads:", error)
        setLeads([])
      } else {
        setLeads((data ?? []).map(mapSubmissionToLead))
      }
      setLoading(false)
    }
    fetchLeads()
    return () => { isMounted = false }
  }, [supabase])

  const filteredLeads = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return leads
    return leads.filter((lead) => JSON.stringify(lead).toLowerCase().includes(term))
  }, [leads, searchTerm])

  const leadsByStatus = useMemo(() => {
    const grouped: { [key: string]: Lead[] } = { new: [], contacted: [], qualified: [], archived: [] }
    filteredLeads.forEach((lead) => {
      const status = lead.status.toLowerCase()
      if (grouped[status]) grouped[status].push(lead)
      else grouped.new.push(lead)
    })
    return grouped
  }, [filteredLeads])

  const handleStatusChange = (leadId: number, newStatus: string) => {
    setLeads(leads.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead)))
    if (selectedLead && selectedLead.id === leadId) setSelectedLead({ ...selectedLead, status: newStatus })
    if (supabase) { /* TODO: Persist status change to Supabase */ }
  }

  const statusConfig: { [key: string]: { icon: React.ElementType; varName: string } } = {
    new: { icon: Inbox, varName: "--chart-1" },
    contacted: { icon: Send, varName: "--chart-3" },
    qualified: { icon: CheckCircle, varName: "--chart-2" },
    archived: { icon: Archive, varName: "--chart-5" },
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.keys(leadsByStatus).map((status) => {
          const config = statusConfig[status]
          const count = leadsByStatus[status].length
          return (
            <button key={status} onClick={() => setSelectedStatus(status)} className={cn("p-4 rounded-lg border-b-4 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:scale-105 hover:shadow-lg", selectedStatus === status ? "border-[hsl(var(--primary))] shadow-lg" : "border-transparent hover:bg-muted/50")}>
              <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold capitalize text-muted-foreground">{status}</h3>
                <config.icon className={cn("h-6 w-6", status === "new" ? "text-chart-1" : status === "contacted" ? "text-chart-3" : status === "qualified" ? "text-chart-2" : "text-chart-5")} />
              </div>
              <p className="text-3xl font-bold mt-2 text-foreground">{count}</p>
            </button>
          )
        })}
      </div>

      <Card className="shadow-sm border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="capitalize text-xl font-semibold flex items-center gap-3">
            <div className={cn("w-3 h-3 rounded-full", selectedStatus === "new" ? "bg-chart-1" : selectedStatus === "contacted" ? "bg-chart-3" : selectedStatus === "qualified" ? "bg-chart-2" : "bg-chart-5")} />
            {selectedStatus} Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-muted-foreground col-span-full text-center p-8">
                <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                Loading leads...
              </p>
            ) : leadsByStatus[selectedStatus].length > 0 ? (
              leadsByStatus[selectedStatus].map((lead) => (
                <Card key={lead.id} onClick={() => setSelectedLead(lead)} className="cursor-pointer overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:scale-[1.02] group">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg truncate group-hover:text-accent transition-colors duration-200">{lead.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground truncate">{lead.email}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline" className="uppercase text-xs">{lead.formType.replace(/_/g, " ")}</Badge>
                      <p className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground col-span-full text-center p-8">
                No leads in this category.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedLead)} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-0 shadow-2xl animate-scale-in">
          <DialogHeader className="p-6 border-b border-border/50 text-center">
            <DialogTitle className="text-2xl font-serif">
              <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md shadow-sm">{selectedLead?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              From '{selectedLead?.formType.replace(/_/g, " ")}' &middot; Received on{" "}
              {selectedLead ? new Date(selectedLead.createdAt).toLocaleString() : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <InfoField label="Email" icon={Mail}><a href={`mailto:${selectedLead.email}`} className="hover:underline break-words">{selectedLead.email}</a></InfoField>
                <InfoField label="Phone" icon={Phone}><a href={`tel:${selectedLead.phone}`} className="hover:underline break-words">{selectedLead.phone}</a></InfoField>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Full Form Details</h3>
                <div className="p-4 border rounded-lg space-y-3 max-h-48 overflow-y-auto bg-background/50">
                  {Object.keys(selectedLead.rawData).length > 0 ? Object.entries(selectedLead.rawData).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-2 text-sm"><span className="col-span-1 font-medium text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span><span className="col-span-2 text-foreground break-words">{String(value) || <span className="text-muted-foreground/60">empty</span>}</span></div>
                  )) : <p className="text-sm text-muted-foreground text-center">No additional data submitted.</p>}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Update Status</h3>
                <Select value={selectedLead.status} onValueChange={(newStatus) => handleStatusChange(selectedLead.id, newStatus)}>
                  <SelectTrigger className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
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

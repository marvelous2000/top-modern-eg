"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useSupabaseClient } from "@/components/providers/SupabaseProvider"
import { Loader2, Search } from "lucide-react"

type RawSubmission = {
  id: number
  form_type: string | null
  form_data: Record<string, any> | null
  status: string | null
  created_at: string | null
  processed_at?: string | null
}

type Lead = {
  id: number
  name: string
  email: string
  phone: string
  formType: string
  status: string
  createdAt: string
  rawData: Record<string, any>
}

const fallbackLeads: Lead[] = []

function resolveField<T extends string | undefined>(value: any, fallback: T): T | string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim()
  }
  if (typeof value === "number") {
    return value.toString()
  }
  return fallback
}

function mapSubmissionToLead(submission: RawSubmission): Lead {
  const data = submission.form_data ?? {}
  const name =
    resolveField(data.name, undefined) ??
    resolveField(data.full_name, undefined) ??
    resolveField(data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined, "Unknown")

  const email =
    resolveField(data.email, undefined) ??
    resolveField(data.emailAddress, undefined) ??
    resolveField(data.contact_email, "Not provided")

  const phone =
    resolveField(data.phone, undefined) ??
    resolveField(data.phoneNumber, undefined) ??
    resolveField(data.contact_phone, "Not provided")

  return {
    id: submission.id,
    name,
    email,
    phone,
    formType: submission.form_type ?? "unknown",
    status: submission.status ?? "new",
    createdAt: submission.created_at ?? new Date().toISOString(),
    rawData: data,
  }
}

function mapLocalSubmissionToLead(entry: any, index: number): Lead {
  const timestamp = typeof entry?.timestamp === "string" ? entry.timestamp : new Date().toISOString()
  const formData = entry?.formData ?? {}

  const name =
    resolveField(formData.name, undefined) ??
    resolveField(
      formData.firstName || formData.lastName
        ? `${formData.firstName ?? ""} ${formData.lastName ?? ""}`.trim()
        : undefined,
      "Unknown",
    )

  const email =
    resolveField(formData.email, undefined) ?? resolveField(formData.emailAddress, undefined) ?? "Not provided"

  const phone =
    resolveField(formData.phone, undefined) ?? resolveField(formData.phoneNumber, undefined) ?? "Not provided"

  return {
    id: Date.parse(timestamp) || index + 1,
    name,
    email,
    phone,
    formType: entry?.formType ?? "unknown",
    status: "new",
    createdAt: timestamp,
    rawData: formData,
  }
}

export function LeadsManager() {
  const supabase = useSupabaseClient({ optional: true })
  const [loading, setLoading] = useState(true)
  const [remoteLeads, setRemoteLeads] = useState<Lead[]>([])
  const [localLeads, setLocalLeads] = useState<Lead[]>(fallbackLeads)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      const stored = JSON.parse(window.localStorage.getItem("formSubmissions") ?? "[]")
      if (Array.isArray(stored) && stored.length) {
        const mapped = stored.map(mapLocalSubmissionToLead).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        setLocalLeads(mapped)
      } else {
        setLocalLeads([])
      }
    } catch (error) {
      console.warn("Unable to parse local form submissions", error)
      setLocalLeads([])
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let isMounted = true

    ;(async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("form_submissions")
          .select("id, form_type, form_data, status, created_at")
          .order("created_at", { ascending: false })
          .limit(200)

        if (error) {
          throw error
        }

        if (!isMounted) return

        const mapped = (data ?? []).map(mapSubmissionToLead)
        setRemoteLeads(mapped)
      } catch (err) {
        console.error("Failed to load leads:", err)
        setRemoteLeads([])
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [supabase])

  const combinedLeads = useMemo(() => {
    if (remoteLeads.length) {
      return remoteLeads
    }
    if (localLeads.length) {
      return localLeads
    }
    return fallbackLeads
  }, [remoteLeads, localLeads])

  const filteredLeads = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return combinedLeads
    return combinedLeads.filter((lead) => {
      const bucket = [
        lead.name,
        lead.email,
        lead.phone,
        lead.formType,
        Object.values(lead.rawData).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return bucket.includes(term)
    })
  }, [combinedLeads, searchTerm])

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processed":
      case "contacted":
        return "bg-green-500/20 text-green-400"
      case "archived":
        return "bg-muted text-muted-foreground"
      case "new":
      default:
        return "bg-primary/20 text-primary"
    }
  }

  const formatDate = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return "Unknown"
    }
    return date.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">Lead Inbox</CardTitle>
            <p className="text-sm text-muted-foreground">
              All website form submissions are captured here for quick follow-up.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search leads by name, email, phone, or keyword"
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      <div className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading leads...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredLeads.length ? (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                      <TableCell className="text-muted-foreground">{lead.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {lead.formType.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColor(lead.status)}>{lead.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(lead.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="secondary" onClick={() => setSelectedLead(lead)}>
                          View Lead
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No leads found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedLead)} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedLead ? formatDate(selectedLead.createdAt) : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground break-all">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Form Source</p>
                  <Badge variant="outline" className="uppercase">
                    {selectedLead.formType.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Submitted Data</p>
                <div className="rounded-md border border-border bg-muted/40">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-3 p-4 text-sm">
                    {Object.entries(selectedLead.rawData).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-[120px_1fr] items-start gap-3">
                        <dt className="font-medium text-muted-foreground uppercase tracking-wide text-xs">{key}</dt>
                        <dd className="text-foreground whitespace-pre-wrap break-words">
                          {Array.isArray(value) ? value.join(", ") : typeof value === "object" ? JSON.stringify(value, null, 2) : String(value ?? "")}
                        </dd>
                      </div>
                    ))}
                    {!Object.keys(selectedLead.rawData).length && (
                      <p className="text-muted-foreground">No additional fields submitted.</p>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

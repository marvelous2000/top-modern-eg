"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Edit, Trash2, Search, Filter, Save, X, UserPlus, Building, Phone, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

const mockContacts = [
  { id: 1, name: "Ahmed Hassan", email: "ahmed@luxuryhotel.com", company: "Luxury Hotel Group", phone: "+20 123 456 789", status: "New", date: "2024-01-15", source: "Contact Form", notes: "Interested in marble flooring for hotel lobby renovation project. Budget: $50,000+", projectType: "Commercial", budget: "$50,000+", timeline: "3-6 months", lastUpdated: "2024-01-15", lastUpdatedBy: "Admin User" },
  { id: 2, name: "Sarah Al-Rashid", email: "sarah@realestategroup.ae", company: "Premium Real Estate", phone: "+971 50 123 4567", status: "Contacted", date: "2024-01-14", source: "Phone Call", notes: "Looking for granite countertops for luxury villa project in Dubai. Requires premium quality materials.", projectType: "Residential", budget: "$30,000+", timeline: "1-3 months", lastUpdated: "2024-01-16", lastUpdatedBy: "Sales Manager" },
  { id: 3, name: "Mohamed Farid", email: "m.farid@restaurant.com", company: "Fine Dining Restaurant", phone: "+20 100 123 456", status: "Qualified", date: "2024-01-13", source: "Website", notes: "Restaurant renovation project. Needs marble tables and granite bar counters. High-end finish required.", projectType: "Commercial", budget: "$25,000+", timeline: "2-4 months", lastUpdated: "2024-01-17", lastUpdatedBy: "Project Manager" },
]

const InfoField = ({ label, value, isEditing, children }: { label: string; value: React.ReactNode; isEditing?: boolean; children?: React.ReactNode }) => (
  <div className="space-y-1"><Label className="text-sm font-medium text-muted-foreground">{label}</Label>{isEditing ? <div className="text-sm">{children}</div> : <div className="text-sm font-semibold text-foreground">{value}</div>}</div>
)

export function ContactsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [contacts, setContacts] = useState(mockContacts)
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContact, setEditedContact] = useState<any>(null)

  const statusConfig: { [key: string]: { color: string; textColor?: string } } = {
    New: { color: "bg-[hsl(var(--chart-1)_/_0.2)]", textColor: "hsl(var(--chart-1))" },
    Contacted: { color: "bg-[hsl(var(--chart-3)_/_0.2)]", textColor: "hsl(var(--chart-3))" },
    Qualified: { color: "bg-[hsl(var(--chart-2)_/_0.2)]", textColor: "hsl(var(--chart-2))" },
    Closed: { color: "bg-destructive/20 text-destructive" },
  }

  const handleViewContact = (contact: any) => { setSelectedContact(contact); setEditedContact({ ...contact }); setIsModalOpen(true); setIsEditing(false) }
  const handleEditContact = () => setIsEditing(true)
  const handleSaveContact = () => { const updated = { ...editedContact, lastUpdated: new Date().toISOString().split("T")[0], lastUpdatedBy: "Admin User" }; setContacts(contacts.map((c) => (c.id === updated.id ? updated : c))); setSelectedContact(updated); setIsEditing(false) }
  const handleCancelEdit = () => { setEditedContact({ ...selectedContact }); setIsEditing(false) }
  const handleInputChange = (field: string, value: string) => setEditedContact({ ...editedContact, [field]: value })

  const filteredContacts = useMemo(() => contacts.filter((contact) => JSON.stringify(contact).toLowerCase().includes(searchTerm.toLowerCase())), [contacts, searchTerm])

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div><CardTitle className="text-2xl font-serif text-foreground">Contacts</CardTitle><p className="text-sm text-muted-foreground">Manage all business and client contacts.</p></div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search contacts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-muted/50 w-full" /></div>
            <Button variant="outline" className="w-full sm:w-auto"><Filter className="h-4 w-4 mr-2" />Filter</Button>
            <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"><UserPlus className="h-4 w-4 mr-2" />Add Contact</Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContacts.map(contact => (
          <Card key={contact.id} onClick={() => handleViewContact(contact)} className="cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <CardTitle className="text-lg truncate">{contact.name}</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-2 truncate"><Building className="h-4 w-4 flex-shrink-0" />{contact.company}</p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex justify-between items-center mt-2">
                <Badge className={cn("capitalize text-xs", statusConfig[contact.status]?.color)} style={{ color: statusConfig[contact.status]?.textColor }}>{contact.status}</Badge>
                <p className="text-xs text-muted-foreground">{contact.date}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b text-center">
            <DialogTitle className="text-2xl font-serif">
              {isEditing ? "Edit Contact" : <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md">{selectedContact?.name}</span>}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              {isEditing ? "Update the contact's information below." : "Viewing contact details and project information."}
            </DialogDescription>
          </DialogHeader>
          {selectedContact && <>
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Full Name" value={selectedContact.name} isEditing={isEditing}><Input value={editedContact.name} onChange={(e) => handleInputChange("name", e.target.value)} /></InfoField>
                <InfoField label="Company" value={selectedContact.company} isEditing={isEditing}><Input value={editedContact.company} onChange={(e) => handleInputChange("company", e.target.value)} /></InfoField>
                <InfoField label="Email" value={selectedContact.email} isEditing={isEditing}><Input type="email" value={editedContact.email} onChange={(e) => handleInputChange("email", e.target.value)} /></InfoField>
                <InfoField label="Phone" value={selectedContact.phone} isEditing={isEditing}><Input value={editedContact.phone} onChange={(e) => handleInputChange("phone", e.target.value)} /></InfoField>
                <InfoField label="Project Type" value={selectedContact.projectType} isEditing={isEditing}><Select value={editedContact.projectType} onValueChange={(v) => handleInputChange("projectType", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Residential">Residential</SelectItem><SelectItem value="Commercial">Commercial</SelectItem><SelectItem value="Industrial">Industrial</SelectItem></SelectContent></Select></InfoField>
                <InfoField label="Budget" value={editedContact.budget} isEditing={isEditing}><Input value={editedContact.budget} onChange={(e) => handleInputChange("budget", e.target.value)} /></InfoField>
                <InfoField label="Timeline" value={editedContact.timeline} isEditing={isEditing}><Input value={editedContact.timeline} onChange={(e) => handleInputChange("timeline", e.target.value)} /></InfoField>
                <InfoField label="Source" value={editedContact.source} isEditing={isEditing}><Input value={editedContact.source} onChange={(e) => handleInputChange("source", e.target.value)} /></InfoField>
                <InfoField label="Status" value={<Badge className={cn("capitalize", statusConfig[selectedContact.status]?.color)} style={{ color: statusConfig[selectedContact.status]?.textColor }}>{selectedContact.status}</Badge>} isEditing={isEditing}><Select value={editedContact.status} onValueChange={(v) => handleInputChange("status", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Contacted">Contacted</SelectItem><SelectItem value="Qualified">Qualified</SelectItem><SelectItem value="Closed">Closed</SelectItem></SelectContent></Select></InfoField>
              </div>
              <div className="space-y-2"><Label className="text-sm font-medium text-muted-foreground">Notes</Label>{isEditing ? <Textarea value={editedContact.notes} onChange={(e) => handleInputChange("notes", e.target.value)} className="min-h-[100px]" /> : <div className="text-sm text-foreground bg-muted/50 p-4 rounded-md border min-h-[100px] whitespace-pre-wrap">{selectedContact.notes || <span className="text-muted-foreground/70">No notes added.</span>}</div>}</div>
              <div className="mt-6 pt-4 border-t text-xs text-muted-foreground flex justify-between"><p>Created: {selectedContact.date}</p><p>Last Updated: {selectedContact.lastUpdated} by {selectedContact.lastUpdatedBy}</p></div>
            </div>
            <div className="flex justify-end space-x-2 p-4 bg-card border-t">
              {!isEditing ? <Button onClick={handleEditContact} className="bg-primary text-primary-foreground hover:bg-primary/90"><Edit className="h-4 w-4 mr-2" /> Edit Contact</Button> : <>
                <Button onClick={handleCancelEdit} variant="outline">Cancel</Button>
                <Button onClick={handleSaveContact} className="bg-primary text-primary-foreground hover:bg-primary/90"><Save className="h-4 w-4 mr-2" /> Save Changes</Button>
              </>}
            </div>
          </>}
        </DialogContent>
      </Dialog>
    </div>
  )
}

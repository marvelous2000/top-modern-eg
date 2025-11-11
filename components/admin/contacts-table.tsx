"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
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
  <div className="space-y-2">
    <Label className="font-semibold">{label}</Label>
    {isEditing ? <div>{children}</div> : <div className="text-sm text-foreground">{value}</div>}
  </div>
)

const getInitials = (name: string) => {
  if (!name) return ''
  const names = name.split(' ')
  if (names.length === 1) return names[0].charAt(0).toUpperCase()
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
}

export function ContactsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [contacts, setContacts] = useState(mockContacts)
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContact, setEditedContact] = useState<any>(null)

  const statusConfig: { [key: string]: string } = {
    New: "bg-blue-500/20 text-blue-500",
    Contacted: "bg-orange-500/20 text-orange-500",
    Qualified: "bg-green-500/20 text-green-500",
    Closed: "bg-red-500/20 text-red-500",
  }

  const handleViewContact = (contact: any) => { setSelectedContact(contact); setEditedContact({ ...contact }); setIsModalOpen(true); setIsEditing(false) }
  const handleEditContact = () => setIsEditing(true)
  const handleSaveContact = () => { const updated = { ...editedContact, lastUpdated: new Date().toISOString().split("T")[0], lastUpdatedBy: "Admin User" }; setContacts(contacts.map((c) => (c.id === updated.id ? updated : c))); setSelectedContact(updated); setIsEditing(false) }
  const handleCancelEdit = () => { setEditedContact({ ...selectedContact }); setIsEditing(false) }
  const handleInputChange = (field: string, value: string) => setEditedContact({ ...editedContact, [field]: value })

  const filteredContacts = useMemo(() => contacts.filter((contact) => JSON.stringify(contact).toLowerCase().includes(searchTerm.toLowerCase())), [contacts, searchTerm])

  return (
    <div className="space-y-6 animate-slide-in">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Contacts</CardTitle>
            <p className="text-sm text-muted-foreground">Manage all business and client contacts.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto rounded-lg">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="w-full sm:w-auto rounded-lg transition-transform duration-200 hover:-translate-y-0.5">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContacts.map(contact => (
          <Card
            key={contact.id}
            onClick={() => handleViewContact(contact)}
            className="cursor-pointer overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl"
          >
            <CardHeader className="p-4">
              <CardTitle className="text-lg truncate group-hover:text-accent transition-colors duration-200">{contact.name}</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-2 truncate">
                <Building className="h-4 w-4 flex-shrink-0" />
                {contact.company}
              </p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex justify-between items-center mt-2">
                <Badge className={cn("capitalize text-xs rounded-md", statusConfig[contact.status])}>
                  {contact.status}
                </Badge>
                <p className="text-xs text-muted-foreground">{contact.date}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl p-0 rounded-xl animate-fade-in-slide-down">
          <DialogHeader className="p-6 bg-accent text-accent-foreground text-center relative rounded-t-xl">
            <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold">
                    {getInitials(selectedContact?.name)}
                </div>
                <div>
                    <DialogTitle className="text-2xl font-bold">{selectedContact?.name}</DialogTitle>
                    <DialogDescription className="text-accent-foreground/80">{isEditing ? "Update the contact's information below." : "Viewing contact details and project information."}</DialogDescription>
                </div>
            </div>
            <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          {selectedContact && <>
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Full Name" value={selectedContact.name} isEditing={isEditing}><Input className="rounded-lg p-3" value={editedContact.name} onChange={(e) => handleInputChange("name", e.target.value)} /></InfoField>
                <InfoField label="Company" value={selectedContact.company} isEditing={isEditing}><Input className="rounded-lg p-3" value={editedContact.company} onChange={(e) => handleInputChange("company", e.target.value)} /></InfoField>
                <InfoField label="Email" value={selectedContact.email} isEditing={isEditing}><Input className="rounded-lg p-3" type="email" value={editedContact.email} onChange={(e) => handleInputChange("email", e.target.value)} /></InfoField>
                <InfoField label="Phone" value={selectedContact.phone} isEditing={isEditing}><Input className="rounded-lg p-3" value={editedContact.phone} onChange={(e) => handleInputChange("phone", e.target.value)} /></InfoField>
                <InfoField label="Project Type" value={selectedContact.projectType} isEditing={isEditing}><Select value={editedContact.projectType} onValueChange={(v) => handleInputChange("projectType", v)}><SelectTrigger className="rounded-lg p-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Residential">Residential</SelectItem><SelectItem value="Commercial">Commercial</SelectItem><SelectItem value="Industrial">Industrial</SelectItem></SelectContent></Select></InfoField>
                <InfoField label="Budget" value={editedContact.budget} isEditing={isEditing}><Input className="rounded-lg p-3" value={editedContact.budget} onChange={(e) => handleInputChange("budget", e.target.value)} /></InfoField>
                <InfoField label="Timeline" value={editedContact.timeline} isEditing={isEditing}><Input className="rounded-lg p-3" value={editedContact.timeline} onChange={(e) => handleInputChange("timeline", e.target.value)} /></InfoField>
                <InfoField label="Source" value={editedContact.source} isEditing={isEditing}><Input className="rounded-lg p-3" value={editedContact.source} onChange={(e) => handleInputChange("source", e.target.value)} /></InfoField>
                <InfoField label="Status" value={<Badge className={cn("capitalize text-xs rounded-md", statusConfig[selectedContact.status])}>{selectedContact.status}</Badge>} isEditing={isEditing}><Select value={editedContact.status} onValueChange={(v) => handleInputChange("status", v)}><SelectTrigger className="rounded-lg p-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Contacted">Contacted</SelectItem><SelectItem value="Qualified">Qualified</SelectItem><SelectItem value="Closed">Closed</SelectItem></SelectContent></Select></InfoField>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Notes</Label>
                {isEditing 
                  ? <Textarea value={editedContact.notes} onChange={(e) => handleInputChange("notes", e.target.value)} className="min-h-[120px] rounded-lg p-3" /> 
                  : <div className="text-sm text-foreground bg-muted/20 p-4 rounded-lg border min-h-[120px] whitespace-pre-wrap">{selectedContact.notes || <span className="text-muted-foreground/70">No notes added.</span>}</div>
                }
              </div>
              <div className="mt-6 pt-4 border-t text-xs text-muted-foreground flex justify-between">
                <p>Created: {selectedContact.date}</p>
                <p>Last Updated: {selectedContact.lastUpdated} by {selectedContact.lastUpdatedBy}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-4 bg-muted/30 border-t rounded-b-xl">
              {!isEditing ? (
                <Button onClick={handleEditContact} className="rounded-lg transition-transform duration-200 hover:-translate-y-0.5">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Contact
                </Button>
              ) : (
                <>
                  <Button onClick={handleCancelEdit} variant="outline" className="rounded-lg">Cancel</Button>
                  <Button onClick={handleSaveContact} className="rounded-lg transition-transform duration-200 hover:-translate-y-0.5">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </>}
        </DialogContent>
      </Dialog>
    </div>
  )
}

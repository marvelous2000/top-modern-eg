"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Edit, Trash2, Search, Filter, Save, X, UserPlus, Building, Phone, Mail, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getContacts, createContact, updateContact, deleteContact, type Contact } from "@/lib/actions/contacts"
import { toast } from "sonner"

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
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContact, setEditedContact] = useState<Contact | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: "",
    email: "",
    company: "",
    phone: "",
    status: "New",
    date: new Date().toISOString().split("T")[0],
    source: "",
    notes: "",
    projectType: "Residential",
    budget: "",
    timeline: ""
  })

  const statusConfig: { [key: string]: string } = {
    New: "bg-blue-500/20 text-blue-500",
    Contacted: "bg-orange-500/20 text-orange-500",
    Qualified: "bg-green-500/20 text-green-500",
    Closed: "bg-red-500/20 text-red-500",
  }

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true)
      const result = await getContacts()
      if (result.success && result.data) {
        setContacts(result.data)
      } else {
        toast.error("Failed to load contacts")
      }
      setIsLoading(false)
    }
    fetchContacts()
  }, [])

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact)
    setEditedContact({ ...contact })
    setIsModalOpen(true)
    setIsEditing(false)
  }

  const handleEditContact = () => setIsEditing(true)

  const handleSaveContact = async () => {
    if (!editedContact || !selectedContact?.id) return

    const result = await updateContact(selectedContact.id, editedContact)
    if (result.success) {
      setContacts(contacts.map((c) => (c.id === selectedContact.id ? result.data : c)))
      setSelectedContact(result.data)
      setIsEditing(false)
      toast.success("Contact updated successfully")
    } else {
      toast.error("Failed to update contact")
    }
  }

  const handleCancelEdit = () => {
    setEditedContact(selectedContact ? { ...selectedContact } : null)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    if (editedContact) {
      setEditedContact({ ...editedContact, [field]: value })
    }
  }

  const handleCreateContact = async () => {
    setIsCreating(true)
    const result = await createContact(newContact as Omit<Contact, 'id'>)
    if (result.success) {
      setContacts([result.data, ...contacts])
      setIsCreateModalOpen(false)
      setNewContact({
        name: "",
        email: "",
        company: "",
        phone: "",
        status: "New",
        date: new Date().toISOString().split("T")[0],
        source: "",
        notes: "",
        projectType: "Residential",
        budget: "",
        timeline: ""
      })
      toast.success("Contact created successfully")
    } else {
      toast.error("Failed to create contact")
    }
    setIsCreating(false)
  }

  const handleNewContactInputChange = (field: string, value: string) => {
    setNewContact({ ...newContact, [field]: value })
  }

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
            <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto rounded-lg transition-transform duration-200 hover:-translate-y-0.5">
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
                <InfoField label="Full Name" value={selectedContact.name} isEditing={isEditing}><Input className="rounded-lg p-3" value={editedContact?.name || ""} onChange={(e) => handleInputChange("name", e.target.value)} /></InfoField>
                <InfoField label="Company" value={selectedContact.company} isEditing={isEditing}><Input className="rounded-lg p-3" value={editedContact?.company || ""} onChange={(e) => handleInputChange("company", e.target.value)} /></InfoField>
                <InfoField label="Email" value={selectedContact.email} isEditing={isEditing}><Input className="rounded-lg p-3" type="email" value={editedContact?.email || ""} onChange={(e) => handleInputChange("email", e.target.value)} /></InfoField>
                <InfoField label="Phone" value={selectedContact.phone} isEditing={isEditing}><Input className="rounded-lg p-3" value={editedContact?.phone || ""} onChange={(e) => handleInputChange("phone", e.target.value)} /></InfoField>
                <InfoField label="Project Type" value={selectedContact.projectType} isEditing={isEditing}><Select value={editedContact?.projectType || ""} onValueChange={(v) => handleInputChange("projectType", v)}><SelectTrigger className="rounded-lg p-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Residential">Residential</SelectItem><SelectItem value="Commercial">Commercial</SelectItem><SelectItem value="Industrial">Industrial</SelectItem></SelectContent></Select></InfoField>
                <InfoField label="Budget" value={editedContact?.budget || ""} isEditing={isEditing}><Input className="rounded-lg p-3" value={editedContact?.budget || ""} onChange={(e) => handleInputChange("budget", e.target.value)} /></InfoField>
                <InfoField label="Timeline" value={editedContact?.timeline || ""} isEditing={isEditing}><Input className="rounded-lg p-3" value={editedContact?.timeline || ""} onChange={(e) => handleInputChange("timeline", e.target.value)} /></InfoField>
                <InfoField label="Source" value={editedContact?.source || ""} isEditing={isEditing}><Input className="rounded-lg p-3" value={editedContact?.source || ""} onChange={(e) => handleInputChange("source", e.target.value)} /></InfoField>
                <InfoField label="Status" value={<Badge className={cn("capitalize text-xs rounded-md", statusConfig[selectedContact.status])}>{selectedContact.status}</Badge>} isEditing={isEditing}><Select value={editedContact?.status || ""} onValueChange={(v) => handleInputChange("status", v)}><SelectTrigger className="rounded-lg p-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Contacted">Contacted</SelectItem><SelectItem value="Qualified">Qualified</SelectItem><SelectItem value="Closed">Closed</SelectItem></SelectContent></Select></InfoField>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Notes</Label>
                {isEditing
                  ? <Textarea value={editedContact?.notes || ""} onChange={(e) => handleInputChange("notes", e.target.value)} className="min-h-[120px] rounded-lg p-3" />
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

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl p-0 rounded-xl animate-fade-in-slide-down">
          <DialogHeader className="p-6 bg-accent text-accent-foreground text-center relative rounded-t-xl">
            <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold">
                    <UserPlus className="h-6 w-6" />
                </div>
                <div>
                    <DialogTitle className="text-2xl font-bold">Add New Contact</DialogTitle>
                    <DialogDescription className="text-accent-foreground/80">Enter the contact's information below.</DialogDescription>
                </div>
            </div>
            <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-semibold">Full Name *</Label>
                <Input
                  className="rounded-lg p-3"
                  value={newContact.name}
                  onChange={(e) => handleNewContactInputChange("name", e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Company</Label>
                <Input
                  className="rounded-lg p-3"
                  value={newContact.company}
                  onChange={(e) => handleNewContactInputChange("company", e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Email *</Label>
                <Input
                  className="rounded-lg p-3"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => handleNewContactInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Phone</Label>
                <Input
                  className="rounded-lg p-3"
                  value={newContact.phone}
                  onChange={(e) => handleNewContactInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Project Type</Label>
                <Select value={newContact.projectType} onValueChange={(v) => handleNewContactInputChange("projectType", v)}>
                  <SelectTrigger className="rounded-lg p-3">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Budget</Label>
                <Input
                  className="rounded-lg p-3"
                  value={newContact.budget}
                  onChange={(e) => handleNewContactInputChange("budget", e.target.value)}
                  placeholder="Enter budget"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Timeline</Label>
                <Input
                  className="rounded-lg p-3"
                  value={newContact.timeline}
                  onChange={(e) => handleNewContactInputChange("timeline", e.target.value)}
                  placeholder="Enter timeline"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Source</Label>
                <Input
                  className="rounded-lg p-3"
                  value={newContact.source}
                  onChange={(e) => handleNewContactInputChange("source", e.target.value)}
                  placeholder="Enter source"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Notes</Label>
              <Textarea
                value={newContact.notes}
                onChange={(e) => handleNewContactInputChange("notes", e.target.value)}
                className="min-h-[120px] rounded-lg p-3"
                placeholder="Enter any additional notes"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 p-4 bg-muted/30 border-t rounded-b-xl">
            <Button onClick={() => setIsCreateModalOpen(false)} variant="outline" className="rounded-lg">
              Cancel
            </Button>
            <Button
              onClick={handleCreateContact}
              disabled={isCreating || !newContact.name || !newContact.email}
              className="rounded-lg transition-transform duration-200 hover:-translate-y-0.5"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Contact
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

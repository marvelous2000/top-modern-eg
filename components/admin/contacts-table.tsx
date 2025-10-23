"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Edit, Trash2, Search, Filter, Save, X } from "lucide-react"

const mockContacts = [
  {
    id: 1,
    name: "Ahmed Hassan",
    email: "ahmed@luxuryhotel.com",
    company: "Luxury Hotel Group",
    phone: "+20 123 456 789",
    status: "New",
    date: "2024-01-15",
    source: "Contact Form",
    notes: "Interested in marble flooring for hotel lobby renovation project. Budget: $50,000+",
    projectType: "Commercial",
    budget: "$50,000+",
    timeline: "3-6 months",
    lastUpdated: "2024-01-15",
    lastUpdatedBy: "Admin User",
  },
  {
    id: 2,
    name: "Sarah Al-Rashid",
    email: "sarah@realestategroup.ae",
    company: "Premium Real Estate",
    phone: "+971 50 123 4567",
    status: "Contacted",
    date: "2024-01-14",
    source: "Phone Call",
    notes: "Looking for granite countertops for luxury villa project in Dubai. Requires premium quality materials.",
    projectType: "Residential",
    budget: "$30,000+",
    timeline: "1-3 months",
    lastUpdated: "2024-01-16",
    lastUpdatedBy: "Sales Manager",
  },
  {
    id: 3,
    name: "Mohamed Farid",
    email: "m.farid@restaurant.com",
    company: "Fine Dining Restaurant",
    phone: "+20 100 123 456",
    status: "Qualified",
    date: "2024-01-13",
    source: "Website",
    notes: "Restaurant renovation project. Needs marble tables and granite bar counters. High-end finish required.",
    projectType: "Commercial",
    budget: "$25,000+",
    timeline: "2-4 months",
    lastUpdated: "2024-01-17",
    lastUpdatedBy: "Project Manager",
  },
]

export function ContactsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [contacts, setContacts] = useState(mockContacts)
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContact, setEditedContact] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-500"
      case "Contacted":
        return "bg-yellow-500"
      case "Qualified":
        return "bg-green-500"
      case "Closed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleViewContact = (contact: any) => {
    setSelectedContact(contact)
    setEditedContact({ ...contact })
    setIsModalOpen(true)
    setIsEditing(false)
  }

  const handleEditContact = () => {
    setIsEditing(true)
  }

  const handleSaveContact = () => {
    const updatedContact = {
      ...editedContact,
      lastUpdated: new Date().toISOString().split("T")[0],
      lastUpdatedBy: "Admin User", // In real app, this would be the logged-in user
    }

    setContacts(contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c)))
    setSelectedContact(updatedContact)
    setIsEditing(false)

    // In real app, this would save to database
    console.log("[v0] Contact updated:", updatedContact)
  }

  const handleCancelEdit = () => {
    setEditedContact({ ...selectedContact })
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setEditedContact({ ...editedContact, [field]: value })
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Contact List</CardTitle>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{contact.email}</div>
                    <div className="text-muted-foreground">{contact.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(contact.status)} text-white`}>{contact.status}</Badge>
                </TableCell>
                <TableCell>{contact.date}</TableCell>
                <TableCell>{contact.source}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewContact(contact)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-bold text-[#D4AF37]">
                  {isEditing ? "Edit Contact" : "Contact Details"}
                </DialogTitle>
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <Button onClick={handleEditContact} size="sm" className="bg-[#C41E3A] hover:bg-[#A01729]">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSaveContact} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </DialogHeader>

            {selectedContact && (
              <div className="space-y-6 mt-4">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-[#D4AF37] font-semibold">
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editedContact.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-white">{selectedContact.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-[#D4AF37] font-semibold">
                      Company
                    </Label>
                    {isEditing ? (
                      <Input
                        id="company"
                        value={editedContact.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-white">{selectedContact.company}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-[#D4AF37] font-semibold">
                      Email
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedContact.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-white">{selectedContact.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-[#D4AF37] font-semibold">
                      Phone
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editedContact.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-white">{selectedContact.phone}</p>
                    )}
                  </div>
                </div>

                {/* Project Information */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="projectType" className="text-[#D4AF37] font-semibold">
                      Project Type
                    </Label>
                    {isEditing ? (
                      <Select
                        value={editedContact.projectType}
                        onValueChange={(value) => handleInputChange("projectType", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Residential">Residential</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-1 text-white">{selectedContact.projectType}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="budget" className="text-[#D4AF37] font-semibold">
                      Budget
                    </Label>
                    {isEditing ? (
                      <Input
                        id="budget"
                        value={editedContact.budget}
                        onChange={(e) => handleInputChange("budget", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-white">{selectedContact.budget}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="timeline" className="text-[#D4AF37] font-semibold">
                      Timeline
                    </Label>
                    {isEditing ? (
                      <Input
                        id="timeline"
                        value={editedContact.timeline}
                        onChange={(e) => handleInputChange("timeline", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-white">{selectedContact.timeline}</p>
                    )}
                  </div>
                </div>

                {/* Status and Source */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status" className="text-[#D4AF37] font-semibold">
                      Status
                    </Label>
                    {isEditing ? (
                      <Select
                        value={editedContact.status}
                        onValueChange={(value) => handleInputChange("status", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="Qualified">Qualified</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-1">
                        <Badge className={`${getStatusColor(selectedContact.status)} text-white`}>
                          {selectedContact.status}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="source" className="text-[#D4AF37] font-semibold">
                      Source
                    </Label>
                    {isEditing ? (
                      <Input
                        id="source"
                        value={editedContact.source}
                        onChange={(e) => handleInputChange("source", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-white">{selectedContact.source}</p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes" className="text-[#D4AF37] font-semibold">
                    Notes
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="notes"
                      value={editedContact.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="mt-1 min-h-[100px]"
                      placeholder="Add notes about this contact..."
                    />
                  ) : (
                    <p className="mt-1 text-white bg-gray-800 p-3 rounded-md">{selectedContact.notes}</p>
                  )}
                </div>

                {/* Update Information */}
                <div className="border-t border-gray-700 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                    <div>
                      <span className="text-[#D4AF37] font-semibold">Created:</span> {selectedContact.date}
                    </div>
                    <div>
                      <span className="text-[#D4AF37] font-semibold">Last Updated:</span> {selectedContact.lastUpdated}
                    </div>
                    <div className="col-span-2">
                      <span className="text-[#D4AF37] font-semibold">Last Updated By:</span>{" "}
                      {selectedContact.lastUpdatedBy}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

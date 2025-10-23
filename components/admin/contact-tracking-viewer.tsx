"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, FileText, RefreshCw, Trash2, Download, Calendar } from "lucide-react"

interface ContactTracking {
  method: string
  timestamp: string
  details: any
  userAgent: string
  url: string
}

interface FormSubmission {
  formType: string
  timestamp: string
  formData: any
  userAgent: string
  url: string
}

export function ContactTrackingViewer() {
  const [contactTracking, setContactTracking] = useState<ContactTracking[]>([])
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [filteredContactTracking, setFilteredContactTracking] = useState<ContactTracking[]>([])
  const [filteredFormSubmissions, setFilteredFormSubmissions] = useState<FormSubmission[]>([])

  const loadTrackingData = () => {
    const tracking = JSON.parse(localStorage.getItem("contactTracking") || "[]")
    const submissions = JSON.parse(localStorage.getItem("formSubmissions") || "[]")
    setContactTracking(tracking)
    setFormSubmissions(submissions)
  }

  const resetStats = () => {
    if (confirm("Are you sure you want to reset all analytics data? This action cannot be undone.")) {
      localStorage.removeItem("contactTracking")
      localStorage.removeItem("formSubmissions")
      setContactTracking([])
      setFormSubmissions([])
      setFilteredContactTracking([])
      setFilteredFormSubmissions([])
    }
  }

  const exportReport = () => {
    const monthName =
      selectedMonth === "all"
        ? "All_Time"
        : new Date(selectedMonth + "-01").toLocaleDateString("en-US", { year: "numeric", month: "long" })

    // Generate CSV content
    let csvContent = ""

    // Header information
    csvContent += `Top Modern Contact Tracking Report\n`
    csvContent += `Report Date,${new Date().toLocaleDateString()}\n`
    csvContent += `Period,${selectedMonth === "all" ? "All Time" : monthName}\n\n`

    // Summary statistics
    csvContent += `SUMMARY STATISTICS\n`
    csvContent += `Metric,Count\n`
    csvContent += `Total Contact Interactions,${filteredContactTracking.length}\n`
    csvContent += `Total Form Submissions,${filteredFormSubmissions.length}\n`
    csvContent += `Phone Clicks,${filteredContactTracking.filter((item) => item.method === "phone_call").length}\n`
    csvContent += `Email Clicks,${filteredContactTracking.filter((item) => item.method === "email_click").length}\n`
    csvContent += `CTA Clicks,${filteredContactTracking.filter((item) => item.method === "cta_click").length}\n\n`

    // Contact tracking details
    csvContent += `CONTACT TRACKING DETAILS\n`
    csvContent += `Method,Source,Details,Timestamp,User Agent,URL\n`
    filteredContactTracking.forEach((item) => {
      const details = item.details?.number || item.details?.email || item.details?.source || "N/A"
      csvContent += `"${item.method}","${item.details?.source || "Unknown"}","${details}","${new Date(item.timestamp).toLocaleString()}","${item.userAgent}","${item.url}"\n`
    })
    csvContent += `\n`

    // Form submissions
    csvContent += `FORM SUBMISSIONS\n`
    csvContent += `Form Type,First Name,Last Name,Email,Phone,Company,Message,Timestamp,User Agent,URL\n`
    filteredFormSubmissions.forEach((submission) => {
      csvContent += `"${submission.formType}","${submission.formData?.firstName || ""}","${submission.formData?.lastName || ""}","${submission.formData?.email || ""}","${submission.formData?.phone || ""}","${submission.formData?.company || ""}","${submission.formData?.message || ""}","${new Date(submission.timestamp).toLocaleString()}","${submission.userAgent}","${submission.url}"\n`
    })

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Top_Modern_Contact_Tracking_${monthName.replace(/\s+/g, "_")}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filterDataByMonth = (month: string) => {
    if (month === "all") {
      setFilteredContactTracking(contactTracking)
      setFilteredFormSubmissions(formSubmissions)
    } else {
      const filteredContacts = contactTracking.filter((item) => {
        const itemDate = new Date(item.timestamp)
        const itemMonth = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, "0")}`
        return itemMonth === month
      })

      const filteredForms = formSubmissions.filter((item) => {
        const itemDate = new Date(item.timestamp)
        const itemMonth = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, "0")}`
        return itemMonth === month
      })

      setFilteredContactTracking(filteredContacts)
      setFilteredFormSubmissions(filteredForms)
    }
  }

  const getAvailableMonths = () => {
    const allDates = [
      ...contactTracking.map((item) => new Date(item.timestamp)),
      ...formSubmissions.map((item) => new Date(item.timestamp)),
    ]

    const months = new Set<string>()
    allDates.forEach((date) => {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      months.add(monthKey)
    })

    return Array.from(months).sort().reverse()
  }

  useEffect(() => {
    loadTrackingData()
  }, [])

  useEffect(() => {
    filterDataByMonth(selectedMonth)
  }, [selectedMonth, contactTracking, formSubmissions])

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "phone_call":
        return <Phone className="h-4 w-4" />
      case "email_click":
        return <Mail className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "phone_call":
        return "bg-blue-500"
      case "email_click":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const availableMonths = getAvailableMonths()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl font-bold text-foreground">Contact Tracking Analytics</h2>
        <div className="flex items-center space-x-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              {availableMonths.map((month) => (
                <SelectItem key={month} value={month}>
                  {new Date(month + "-01").toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={exportReport}
            variant="outline"
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/80"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>

          <Button onClick={loadTrackingData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Button onClick={resetStats} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Reset Stats
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">{filteredContactTracking.length}</div>
            <p className="text-sm text-muted-foreground">Contact Interactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">{filteredFormSubmissions.length}</div>
            <p className="text-sm text-muted-foreground">Form Submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">
              {filteredContactTracking.filter((item) => item.method === "phone_call").length}
            </div>
            <p className="text-sm text-muted-foreground">Phone Clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">
              {filteredContactTracking.filter((item) => item.method === "email_click").length}
            </div>
            <p className="text-sm text-muted-foreground">Email Clicks</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contacts">Contact Methods ({filteredContactTracking.length})</TabsTrigger>
          <TabsTrigger value="forms">Form Submissions ({filteredFormSubmissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contact Method Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredContactTracking.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No contact tracking data available for selected period
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContactTracking.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getMethodIcon(item.method)}
                            <Badge className={`${getMethodColor(item.method)} text-white`}>
                              {item.method.replace("_", " ")}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{item.details?.source || "Unknown"}</TableCell>
                        <TableCell>{item.details?.number || item.details?.email || "N/A"}</TableCell>
                        <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms">
          <Card>
            <CardHeader>
              <CardTitle>Form Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredFormSubmissions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No form submissions available for selected period
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Form Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFormSubmissions.map((submission, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge className="bg-primary text-primary-foreground">
                            {submission.formType.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {`${submission.formData.firstName || ""} ${submission.formData.lastName || ""}`.trim()}
                        </TableCell>
                        <TableCell>{submission.formData.email}</TableCell>
                        <TableCell>{submission.formData.company || "N/A"}</TableCell>
                        <TableCell>{new Date(submission.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

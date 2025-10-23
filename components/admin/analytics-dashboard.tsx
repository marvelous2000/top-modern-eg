"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Calendar, Download, RefreshCw, Trash2 } from "lucide-react"

const generateMonthlyData = (selectedMonth: string) => {
  const baseData = [
    { month: "Jan", visitors: 1200, contacts: 45 },
    { month: "Feb", visitors: 1400, contacts: 52 },
    { month: "Mar", visitors: 1600, contacts: 61 },
    { month: "Apr", visitors: 1800, contacts: 68 },
    { month: "May", visitors: 2000, contacts: 75 },
    { month: "Jun", visitors: 2200, contacts: 82 },
    { month: "Jul", visitors: 2400, contacts: 89 },
    { month: "Aug", visitors: 2600, contacts: 96 },
    { month: "Sep", visitors: 2800, contacts: 103 },
    { month: "Oct", visitors: 3000, contacts: 110 },
    { month: "Nov", visitors: 3200, contacts: 117 },
    { month: "Dec", visitors: 3400, contacts: 124 },
  ]

  if (selectedMonth === "all") {
    return baseData
  }

  const monthIndex = Number.parseInt(selectedMonth.split("-")[1]) - 1
  return [baseData[monthIndex]]
}

const trafficSources = [
  { name: "Direct", value: 35, color: "#D4AF37" },
  { name: "Search", value: 30, color: "#C41E3A" },
  { name: "Social", value: 20, color: "#666666" },
  { name: "Referral", value: 15, color: "#999999" },
]

export function AnalyticsDashboard() {
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [monthlyData, setMonthlyData] = useState(generateMonthlyData("all"))
  const [contactTracking, setContactTracking] = useState<any[]>([])
  const [formSubmissions, setFormSubmissions] = useState<any[]>([])

  const loadAnalyticsData = () => {
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
      loadAnalyticsData()
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
    csvContent += `Top Modern Analytics Dashboard Report\n`
    csvContent += `Report Date,${new Date().toLocaleDateString()}\n`
    csvContent += `Period,${selectedMonth === "all" ? "All Time" : monthName}\n\n`

    // Summary statistics
    csvContent += `SUMMARY STATISTICS\n`
    csvContent += `Metric,Count\n`
    csvContent += `Total Contact Interactions,${contactTracking.length}\n`
    csvContent += `Total Form Submissions,${formSubmissions.length}\n`
    csvContent += `Phone Clicks,${contactTracking.filter((item) => item.method === "phone_call").length}\n`
    csvContent += `Email Clicks,${contactTracking.filter((item) => item.method === "email_click").length}\n`
    csvContent += `CTA Clicks,${contactTracking.filter((item) => item.method === "cta_click").length}\n\n`

    // Monthly data
    csvContent += `MONTHLY WEBSITE DATA\n`
    csvContent += `Month,Visitors,Contacts\n`
    monthlyData.forEach((item) => {
      csvContent += `${item.month},${item.visitors},${item.contacts}\n`
    })
    csvContent += `\n`

    // Traffic sources
    csvContent += `TRAFFIC SOURCES\n`
    csvContent += `Source,Percentage\n`
    trafficSources.forEach((source) => {
      csvContent += `${source.name},${source.value}%\n`
    })
    csvContent += `\n`

    // Contact tracking details
    csvContent += `CONTACT TRACKING DETAILS\n`
    csvContent += `Method,Source,Details,Timestamp,User Agent,URL\n`
    contactTracking.forEach((item) => {
      const details = item.details?.number || item.details?.email || item.details?.source || "N/A"
      csvContent += `"${item.method}","${item.details?.source || "Unknown"}","${details}","${new Date(item.timestamp).toLocaleString()}","${item.userAgent}","${item.url}"\n`
    })
    csvContent += `\n`

    // Form submissions
    csvContent += `FORM SUBMISSIONS\n`
    csvContent += `First Name,Last Name,Email,Phone,Company,Message,Timestamp,User Agent,URL\n`
    formSubmissions.forEach((submission) => {
      csvContent += `"${submission.formData?.firstName || ""}","${submission.formData?.lastName || ""}","${submission.formData?.email || ""}","${submission.formData?.phone || ""}","${submission.formData?.company || ""}","${submission.formData?.message || ""}","${new Date(submission.timestamp).toLocaleString()}","${submission.userAgent}","${submission.url}"\n`
    })

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Top_Modern_Analytics_Dashboard_${monthName.replace(/\s+/g, "_")}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getAvailableMonths = () => {
    const currentYear = new Date().getFullYear()
    const months = []
    for (let i = 0; i < 12; i++) {
      const monthKey = `${currentYear}-${String(i + 1).padStart(2, "0")}`
      months.push(monthKey)
    }
    return months
  }

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  useEffect(() => {
    setMonthlyData(generateMonthlyData(selectedMonth))
  }, [selectedMonth])

  const availableMonths = getAvailableMonths()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl font-bold text-foreground">Website Analytics Dashboard</h2>
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

          <Button onClick={loadAnalyticsData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Button onClick={resetStats} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Reset Stats
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{selectedMonth === "all" ? "Monthly Visitors & Contacts" : "Selected Period Data"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitors" fill="#D4AF37" />
                <Bar dataKey="contacts" fill="#C41E3A" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contact Tracking Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {contactTracking.filter((item) => item.method === "phone_call").length}
                </div>
                <div className="text-sm text-muted-foreground">Phone Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {contactTracking.filter((item) => item.method === "email_click").length}
                </div>
                <div className="text-sm text-muted-foreground">Email Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{formSubmissions.length}</div>
                <div className="text-sm text-muted-foreground">Form Submissions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {contactTracking.filter((item) => item.method === "cta_click").length}
                </div>
                <div className="text-sm text-muted-foreground">CTA Clicks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

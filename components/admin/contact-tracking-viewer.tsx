"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, FileText, RefreshCw, Trash2, Download, Calendar, BarChart2, PieChart as PieChartIcon, MousePointerClick } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { cn } from "@/lib/utils"

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

const StatCard = ({ title, value, icon: Icon, varName }: { title: string; value: string | number; icon: React.ElementType; varName: string }) => (
  <Card className="shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={cn("h-4 w-4", `text-[hsl(var(${varName}))]`)} />
    </CardHeader>
    <CardContent>
      <div className={cn("text-2xl font-bold", `text-[hsl(var(${varName}))]`)}>{value}</div>
    </CardContent>
  </Card>
)

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
      loadTrackingData()
    }
  }

  const exportReport = () => { /* ... export logic ... */ }

  useEffect(() => {
    loadTrackingData()
  }, [])

  useEffect(() => {
    const filterDataByMonth = (month: string) => {
      if (month === "all") {
        setFilteredContactTracking(contactTracking)
        setFilteredFormSubmissions(formSubmissions)
      } else {
        const filteredContacts = contactTracking.filter((item) => new Date(item.timestamp).toISOString().startsWith(month))
        const filteredForms = formSubmissions.filter((item) => new Date(item.timestamp).toISOString().startsWith(month))
        setFilteredContactTracking(filteredContacts)
        setFilteredFormSubmissions(filteredForms)
      }
    }
    filterDataByMonth(selectedMonth)
  }, [selectedMonth, contactTracking, formSubmissions])

  const availableMonths = useMemo(() => {
    const allDates = [...contactTracking.map((item) => new Date(item.timestamp)), ...formSubmissions.map((item) => new Date(item.timestamp))]
    const months = new Set<string>()
    allDates.forEach((date) => {
      if (!isNaN(date.getTime())) {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        months.add(monthKey)
      }
    })
    return Array.from(months).sort().reverse()
  }, [contactTracking, formSubmissions])

  const chartData = useMemo(() => {
    const allData = [...filteredContactTracking, ...filteredFormSubmissions]
    const monthlyData: { [key: string]: { contacts: number; forms: number } } = {}
    allData.forEach((item) => {
      const date = new Date(item.timestamp)
      if (isNaN(date.getTime())) return
      const month = date.toLocaleString("default", { month: "short", year: "2-digit" })
      if (!monthlyData[month]) monthlyData[month] = { contacts: 0, forms: 0 }
      if ("method" in item) monthlyData[month].contacts++
      else monthlyData[month].forms++
    })
    const barChartData = Object.entries(monthlyData).map(([name, values]) => ({ name, ...values })).reverse()
    const pieChartData = [
      { name: "Phone Calls", value: filteredContactTracking.filter((i) => i.method === "phone_call").length, varName: "--chart-3" },
      { name: "Email Clicks", value: filteredContactTracking.filter((i) => i.method === "email_click").length, varName: "--chart-4" },
      { name: "CTA Clicks", value: filteredContactTracking.filter((i) => i.method === "cta_click").length, varName: "--chart-5" },
    ].filter((item) => item.value > 0)
    return { barChartData, pieChartData }
  }, [filteredContactTracking, filteredFormSubmissions])

  const getMethodStyling = (method: string) => {
    switch (method) {
      case "phone_call": return { icon: Phone, varName: "--chart-3" }
      case "email_click": return { icon: Mail, varName: "--chart-4" }
      default: return { icon: MousePointerClick, varName: "--chart-5" }
    }
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-serif text-foreground">Tracking Analytics</CardTitle>
            <p className="text-sm text-muted-foreground">Review user interactions and form submissions.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-auto md:w-48">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {new Date(month + "-02").toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={exportReport} variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
            <Button onClick={loadTrackingData} variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
            <Button onClick={resetStats} variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Interactions" value={filteredContactTracking.length} icon={MousePointerClick} varName="--chart-1" />
        <StatCard title="Form Submissions" value={filteredFormSubmissions.length} icon={FileText} varName="--chart-2" />
        <StatCard title="Phone Clicks" value={filteredContactTracking.filter((item) => item.method === "phone_call").length} icon={Phone} varName="--chart-3" />
        <StatCard title="Email Clicks" value={filteredContactTracking.filter((item) => item.method === "email_click").length} icon={Mail} varName="--chart-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-3"><BarChart2 className="h-5 w-5 text-muted-foreground" />Activity Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.barChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "hsl(var(--muted) / 0.5)" }} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                <Legend iconSize={10} />
                <Bar dataKey="contacts" fill="hsl(var(--chart-1))" name="Interactions" radius={[4, 4, 0, 0]} />
                <Bar dataKey="forms" fill="hsl(var(--chart-2))" name="Submissions" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-3"><PieChartIcon className="h-5 w-5 text-muted-foreground" />Interaction Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartData.pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                  {chartData.pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(${entry.varName}))`} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                <Legend iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Raw Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="contacts">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contacts">Contact Interactions ({filteredContactTracking.length})</TabsTrigger>
              <TabsTrigger value="forms">Form Submissions ({filteredFormSubmissions.length})</TabsTrigger>
            </TabsList>
            <div className="mt-4 border rounded-md">
              <TabsContent value="contacts" className="mt-0">
                  <Table>
                    <TableHeader><TableRow><TableHead>Method</TableHead><TableHead>Source</TableHead><TableHead>Details</TableHead><TableHead>Timestamp</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredContactTracking.map((item, index) => {
                        const { icon: MethodIcon, varName } = getMethodStyling(item.method)
                        return (
                          <TableRow key={index}>
                            <TableCell><div className="flex items-center gap-2"><MethodIcon className={cn("h-4 w-4", `text-[hsl(var(${varName}))]`)} /> <span className="capitalize">{item.method.replace("_", " ")}</span></div></TableCell>
                            <TableCell><Badge variant="outline">{item.details?.source || "Unknown"}</Badge></TableCell>
                            <TableCell className="text-muted-foreground">{item.details?.number || item.details?.email || "N/A"}</TableCell>
                            <TableCell className="text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
              </TabsContent>
              <TabsContent value="forms" className="mt-0">
                  <Table>
                    <TableHeader><TableRow><TableHead>Form</TableHead><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Timestamp</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredFormSubmissions.map((submission, index) => (
                        <TableRow key={index}>
                          <TableCell><Badge variant="secondary" className="uppercase">{submission.formType.replace("_", " ")}</Badge></TableCell>
                          <TableCell className="font-medium text-foreground">{`${submission.formData.firstName || ""} ${submission.formData.lastName || ""}`.trim()}</TableCell>
                          <TableCell className="text-muted-foreground">{submission.formData.email}</TableCell>
                          <TableCell className="text-muted-foreground">{new Date(submission.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

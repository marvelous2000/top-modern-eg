"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar, FileText, MessageSquare, Users, Eye, TrendingUp, Package, Briefcase, Clock, RefreshCw } from "lucide-react"
import { getProducts, Product } from "@/lib/actions/products"
import { getProjects, Project } from "@/lib/actions/projects"

interface ActivityItem {
  id: string
  type: "form_submission" | "contact_interaction" | "product_created" | "project_created"
  title: string
  description: string
  timestamp: string
  icon: React.ElementType
  color: string
}

// TODO: For a production environment, this data should be fetched from a database
// that stores historical traffic metrics (e.g., daily/monthly visitors and contacts).
// This `generateTrafficData` function currently produces enhanced mock data.
// A full implementation would involve:
// 1. A new database table (e.g., `traffic_logs`) with `date`, `visitors`, `contacts` columns.
// 2. An API endpoint or server action to query this table for the specified timeframe.
const generateTrafficData = (timeframe: string) => {
  const now = new Date()
  const data = []

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = d.toLocaleString('en-us', { month: 'short' })
    const visitors = 1000 + Math.floor(Math.random() * 2500) + i * 150
    const contacts = 30 + Math.floor(Math.random() * 100) + i * 5
    data.push({ month, visitors, contacts })
  }

  if (timeframe === "all") return data
  if (timeframe === "6months") return data.slice(-6)
  if (timeframe === "3months") return data.slice(-3)
  if (timeframe === "1month") return data.slice(-1)

  return data
}

export function DashboardOverview() {
  const [timeframe, setTimeframe] = useState<string>("6months")
  const [trafficData, setTrafficData] = useState(generateTrafficData("6months"))
  const [publishedProducts, setPublishedProducts] = useState(0)
  const [publishedProjects, setPublishedProjects] = useState(0)
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load published products and projects
      const [productsResult, projectsResult] = await Promise.all([
        getProducts(),
        getProjects()
      ])

      if (productsResult.success) {
        const activeProducts = productsResult.data.filter((p: Product) => p.status === "active")
        setPublishedProducts(activeProducts.length)
      }

      if (projectsResult.success) {
        const activeProjects = projectsResult.data.filter((p: Project) => p.status === "active")
        setPublishedProjects(activeProjects.length)
      }

      // Load recent activities from localStorage
      const contactTracking = JSON.parse(localStorage.getItem("contactTracking") || "[]")
      const formSubmissions = JSON.parse(localStorage.getItem("formSubmissions") || "[]")

      const activities: ActivityItem[] = []

      // Add recent form submissions
      formSubmissions.slice(-5).forEach((submission: any, index: number) => {
        activities.push({
          id: `form-${index}`,
          type: "form_submission",
          title: "New Form Submission",
          description: `${submission.formData?.firstName || "Anonymous"} submitted a ${submission.formType} form`,
          timestamp: submission.timestamp,
          icon: FileText,
          color: "text-blue-500"
        })
      })

      // Add recent contact interactions
      contactTracking.slice(-5).forEach((interaction: any, index: number) => {
        activities.push({
          id: `contact-${index}`,
          type: "contact_interaction",
          title: "Contact Interaction",
          description: `${interaction.method.replace("_", " ")} from ${interaction.details?.source || "website"}`,
          timestamp: interaction.timestamp,
          icon: MessageSquare,
          color: "text-green-500"
        })
      })

      // Sort by timestamp (most recent first)
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setRecentActivities(activities.slice(0, 10))

    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    setTrafficData(generateTrafficData(timeframe))
  }, [timeframe])

  const stats = [
    {
      title: "Published Products",
      value: publishedProducts.toString(),
      change: "+12%",
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Published Projects",
      value: publishedProjects.toString(),
      change: "+8%",
      icon: Briefcase,
      color: "text-accent",
    },
    {
      title: "Total Contacts",
      value: "1,234",
      change: "+23%",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Page Views",
      value: "12,345",
      change: "+15%",
      icon: Eye,
      color: "text-accent",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Growth Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">Traffic Growth</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={loadDashboardData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Area type="monotone" dataKey="visitors" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" name="Visitors" fillOpacity={0.3} />
                <Area type="monotone" dataKey="contacts" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" name="Contacts" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-full bg-muted`}>
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

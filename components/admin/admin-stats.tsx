import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, Eye, TrendingUp } from "lucide-react"
import { getDashboardMetrics } from "@/lib/actions/dashboard_metrics"

export async function AdminStats() {
  const { data: metrics, error } = await getDashboardMetrics();

  const stats = [
    {
      title: "Total Contacts",
      value: metrics?.total_contacts.toLocaleString() || "0",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "New Leads", // This is still mock data, will need to be implemented later
      value: "56",
      change: "+8%",
      icon: MessageSquare,
      color: "text-accent",
    },
    {
      title: "Page Views",
      value: metrics?.total_page_views.toLocaleString() || "0",
      icon: Eye,
      color: "text-primary",
    },
    {
      title: "Conversion Rate", // This is still mock data, will need to be implemented later
      value: "3.2%",
      change: "+0.5%",
      icon: TrendingUp,
      color: "text-accent",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            {stat.change && ( // Only display change if it exists
              <p className="text-xs text-muted-foreground">
                <span className="text-accent">{stat.change}</span> from last month
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

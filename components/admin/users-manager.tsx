"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSupabaseClient } from "@/components/providers/SupabaseProvider"
import { toast } from "sonner"
import { Loader2, ShieldCheck, MoreVertical, Pencil, Eye, Search, UserPlus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type AdminUser = { id: string; email: string; name: string; role: "admin" | "editor" | "viewer" | "advertiser"; status: "active" | "invited" | "suspended"; lastActive: string; createdAt: string; }

export function UsersManager() {
  const supabase = useSupabaseClient({ optional: true })
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    let isMounted = true
    async function fetchUsers() {
      setLoading(true)
      try {
        const { data, error } = await supabase.from("profiles").select("id, username, first_name, last_name, role, created_at").order("created_at", { ascending: false })
        if (error) throw error
        if (!isMounted) return
        const mapped = (data ?? []).map<AdminUser>((p) => ({ id: p.id, email: p.username ?? "", name: [p.first_name, p.last_name].filter(Boolean).join(" ") || p.username || "Unknown", role: (p.role ?? "viewer") as AdminUser["role"], status: "active", lastActive: p.created_at ?? new Date().toISOString(), createdAt: p.created_at ?? new Date().toISOString() }))
        setUsers(mapped)
      } catch (error) {
        console.error("Failed to load users", error)
        toast.error("Unable to load users from Supabase.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchUsers()
    return () => { isMounted = false }
  }, [supabase])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = `${user.name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  const handleRoleChange = async (userId: string, role: AdminUser["role"]) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)))
    if (!supabase) {
      toast.info("Supabase not configured. Update will sync when available.")
      return
    }
    try {
      const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)
      if (error) throw error
      toast.success("Role updated successfully")
    } catch (error) {
      console.error("Failed to update role", error)
      toast.error("Could not update role. Please try again.")
    }
  }

  const roleConfig: { [key: string]: { icon: React.ElementType; varName: string } } = {
    admin: { icon: ShieldCheck, varName: "--primary" },
    editor: { icon: Pencil, varName: "--chart-3" },
    advertiser: { icon: Eye, varName: "--chart-1" },
    viewer: { icon: Eye, varName: "--chart-5" },
  }

  const statusConfig: { [key: string]: { color: string } } = {
    active: { color: "bg-[hsl(var(--chart-2)/0.2)] text-[hsl(var(--chart-2))]" },
    invited: { color: "bg-[hsl(var(--chart-3)/0.2)] text-[hsl(var(--chart-3))]" },
    suspended: { color: "bg-destructive/20 text-destructive" },
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-serif text-foreground">Team Management</CardTitle>
            <p className="text-sm text-muted-foreground">Invite and manage team member roles and permissions.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name or email" className="pl-10 bg-muted/50 w-full" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All roles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {Object.keys(roleConfig).map(role => <SelectItem key={role} value={role}><span className="capitalize">{role}</span></SelectItem>)}
              </SelectContent>
            </Select>
            <Button className="w-full sm:w-auto" disabled={!supabase}><UserPlus className="mr-2 h-4 w-4" /> Invite User</Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredUsers.map((user) => {
          const RoleIcon = roleConfig[user.role]?.icon || ShieldCheck
          const roleVarName = roleConfig[user.role]?.varName || "--primary"
          const userStatusConfig = statusConfig[user.status] || {}
          const userInitials = user.name.split(" ").map((n) => n[0]).join("").substring(0, 2)

          return (
            <Card key={user.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Avatar className="w-10 h-10 border">
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg truncate">{user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
                <Badge className={cn("capitalize", userStatusConfig.color)}>{user.status}</Badge>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
                  <p><span className="font-semibold text-foreground">Last Active:</span> {new Date(user.lastActive).toLocaleString()}</p>
                  <p><span className="font-semibold text-foreground">Member Since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
              <div className="p-4 bg-muted/10 border-t flex items-center justify-between">
                <div className="w-48">
                  <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value as AdminUser["role"])}>
                    <SelectTrigger className="bg-background h-9">
                      <div className="flex items-center gap-2">
                        <RoleIcon className="h-4 w-4" style={{ color: `hsl(var(${roleVarName}))` }} />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(roleConfig).map((role) => <SelectItem key={role} value={role}><span className="capitalize">{role}</span></SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Suspend User</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">Delete User</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          )
        })}
      </div>

      {!filteredUsers.length && (
        <div className="w-full h-48 flex items-center justify-center text-muted-foreground bg-card rounded-lg border border-dashed">
          {loading ? <span className="inline-flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Loading...</span> : "No team members found."}
        </div>
      )}
    </div>
  )
}
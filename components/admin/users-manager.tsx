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
    let isMounted = true
    async function fetchUsers() {
      if (!supabase) {
        console.error("Supabase client is unexpectedly null inside fetchUsers.");
        setLoading(false);
        return;
      }
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

    if (supabase) {
      fetchUsers()
    } else {
      setLoading(false)
    }

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
        <Card>
          <CardHeader>
            <CardTitle>Users Manager</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="advertiser">Advertiser</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
  
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusConfig[user.status]?.color}>
                        {user.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {Object.keys(roleConfig).map((role) => (
                            <DropdownMenuItem
                              key={role}
                              onClick={() => handleRoleChange(user.id, role as AdminUser["role"])}
                            >
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
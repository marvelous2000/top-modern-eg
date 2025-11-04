"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { useSupabaseClient } from "@/components/providers/SupabaseProvider"
import { toast } from "sonner"
import { Loader2, ShieldCheck, Shield } from "lucide-react"

type AdminUser = {
  id: string
  email: string
  name: string
  role: "admin" | "editor" | "viewer" | "advertiser"
  status: "active" | "invited" | "suspended"
  lastActive: string
  createdAt: string
}

const seedUsers: AdminUser[] = [
  {
    id: "1",
    email: "sarah.johnson@topmodern.com",
    name: "Sarah Johnson",
    role: "admin",
    status: "active",
    lastActive: "2025-09-10T10:15:00Z",
    createdAt: "2024-12-01T08:00:00Z",
  },
  {
    id: "2",
    email: "ahmed.mansour@topmodern.com",
    name: "Ahmed Mansour",
    role: "editor",
    status: "active",
    lastActive: "2025-09-22T13:45:00Z",
    createdAt: "2025-01-15T09:30:00Z",
  },
  {
    id: "3",
    email: "nada.elshamy@topmodern.com",
    name: "Nada El Shamy",
    role: "advertiser",
    status: "invited",
    lastActive: "2025-09-01T07:20:00Z",
    createdAt: "2025-06-05T11:10:00Z",
  },
]

export function UsersManager() {
  const supabase = useSupabaseClient({ optional: true })
  const [users, setUsers] = useState<AdminUser[]>(seedUsers)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const client = supabase
    let isMounted = true

    async function fetchUsers() {
      setLoading(true)
      try {
        const { data, error } = await client
          .from("profiles")
          .select("id, username, first_name, last_name, role, created_at")
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        if (!isMounted) return

        const mapped = (data ?? []).map<AdminUser>((profile) => ({
          id: profile.id,
          email: profile.username ?? "",
          name:
            [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.username || "Unknown",
          role: (profile.role ?? "viewer") as AdminUser["role"],
          status: "active",
          lastActive: profile.created_at ?? new Date().toISOString(),
          createdAt: profile.created_at ?? new Date().toISOString(),
        }))

        if (mapped.length) {
          setUsers(mapped)
        }
      } catch (error) {
        console.error("Failed to load users", error)
        toast.error("Unable to load users from Supabase. Showing sample data.")
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchUsers()

    return () => {
      isMounted = false
    }
  }, [supabase])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = `${user.name} ${user.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  const handleRoleChange = async (userId: string, role: AdminUser["role"]) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)))

    if (!supabase) {
      toast.info("Supabase is not configured yet. Update will sync once credentials are added.")
      return
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", userId)

      if (error) {
        throw error
      }

      toast.success("Role updated")
    } catch (error) {
      console.error("Failed to update role", error)
      toast.error("Could not update role. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Team Access Control
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="search">Search team members</Label>
            <Input
              id="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name or email"
            />
          </div>
          <div className="space-y-2">
            <Label>Filter by role</Label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="advertiser">Advertiser</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Invite member</Label>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80" disabled={!supabase}>
              Invite User
            </Button>
            {!supabase && (
              <p className="text-xs text-muted-foreground">Connect Supabase to enable invites.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-xl text-foreground">Team Members</CardTitle>
          <Badge variant="outline">
            {filteredUsers.length} active
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <span>{user.name}</span>
                    {user.role === "admin" ? (
                      <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                    ) : (
                      <Shield className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value as AdminUser["role"])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="advertiser">Advertiser</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.status === "active"
                          ? "bg-primary/20 text-primary"
                          : user.status === "invited"
                            ? "bg-accent/20 text-accent"
                            : "bg-destructive/20 text-destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.lastActive).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}

              {!filteredUsers.length && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    {loading ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading team members...
                      </span>
                    ) : (
                      "No team members found"
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { getUsers, createUser, updateUser, deleteUser, type User } from "@/lib/actions/users"
import { Plus, Edit, Trash2, X, Save, Search, Loader2, User as UserIcon, Shield, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export function UsersManager() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getUsers()
        if (result.success) {
          setUsers(result.data as User[])
        } else {
          setError(result.error || "Failed to fetch users")
        }
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      (filterRole === "all" || user.role === filterRole) &&
      (filterStatus === "all" || user.status === filterStatus) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [users, searchTerm, filterRole, filterStatus])

  const handleOpenForm = (user: Partial<User> | null = null) => {
    if (user) {
      setEditingUser(user)
    } else {
      setEditingUser({
        name: "",
        email: "",
        role: "user",
        status: "active",
        avatar: "",
        bio: "",
        phone: "",
        location: "",
        website: "",
        socialLinks: {},
        preferences: {},
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
    setIsFormOpen(true)
  }

  const handleSaveUser = async () => {
    if (!editingUser) return
    try {
      if (editingUser.id) {
        const result = await updateUser(editingUser.id, editingUser as User)
        if (result.success) setUsers(users.map((u) => (u.id === editingUser.id ? (result.data as User) : u)))
        else throw new Error(result.error)
      } else {
        const result = await createUser(editingUser as User)
        if (result.success) setUsers([result.data as User, ...users])
        else throw new Error(result.error)
      }
      setIsFormOpen(false)
      setEditingUser(null)
    } catch (err: any) {
      alert(`Error saving user: ${err.message}`)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const result = await deleteUser(userId)
      if (result.success) setUsers(users.filter((u) => u.id !== userId))
      else alert(`Failed to delete user: ${result.error}`)
    }
  }

  const statusConfig: { [key: string]: { color: string } } = {
    active: { color: "bg-[hsl(var(--chart-2)_/_0.2)] text-[hsl(var(--chart-2))]" },
    inactive: { color: "bg-[hsl(var(--chart-3)_/_0.2)] text-[hsl(var(--chart-3))]" },
    suspended: { color: "bg-destructive/20 text-destructive" },
  }

  const roleConfig: { [key: string]: { color: string; icon: React.ElementType } } = {
    admin: { color: "bg-destructive/20 text-destructive", icon: ShieldCheck },
    moderator: { color: "bg-[hsl(var(--chart-3)_/_0.2)] text-[hsl(var(--chart-3))]", icon: Shield },
    user: { color: "bg-muted/20 text-muted-foreground", icon: UserIcon },
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "'Segoe UI', sans-serif", animation: "slideIn 0.5s ease-out" }}>
      <Card className="shadow-sm border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-serif text-foreground">Users</CardTitle>
            <p className="text-sm text-muted-foreground">Manage user accounts and permissions.</p>
          </div>
          <Button
            onClick={() => handleOpenForm()}
            className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative sm:col-span-2 md:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground flex items-center justify-end">
            {filteredUsers.length} users
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : error ? (
        <div className="h-64 flex flex-col items-center justify-center text-destructive bg-card border border-dashed rounded-lg">
          {error}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground bg-card border border-dashed rounded-lg">
          No users found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            const roleConf = roleConfig[user.role] || roleConfig.user
            return (
              <Card
                key={user.id}
                className="shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:scale-[1.02] cursor-pointer overflow-hidden group"
                onClick={() => handleOpenForm(user)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg truncate group-hover:text-accent transition-colors duration-200">
                    {user.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col p-4 pt-0">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={cn("capitalize text-xs flex items-center gap-1", roleConf.color)}>
                      <roleConf.icon className="h-3 w-3" />
                      {user.role}
                    </Badge>
                    <Badge className={cn("capitalize text-xs", statusConfig[user.status]?.color)}>
                      {user.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">
                    {user.bio || "No bio provided"}
                  </p>
                  <div className="space-y-3 pt-4 mt-4 border-t border-border/50">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                      {user.lastLogin && (
                        <p className="text-xs text-muted-foreground">Last login: {new Date(user.lastLogin).toLocaleDateString()}</p>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenForm(user)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full hover:scale-105 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteUser(user.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-0 shadow-2xl animate-scale-in">
          <DialogHeader className="p-6 border-b border-border/50 text-center bg-gradient-to-r from-accent/10 to-accent/5">
            <DialogTitle className="text-2xl font-serif">
              {editingUser?.id ? (
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full shadow-sm">
                  Edit User
                </span>
              ) : (
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full shadow-sm">
                  Create New User
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Fill in the user details below.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <>
              <div className="p-6 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Full Name *</Label>
                    <Input
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Email *</Label>
                    <Input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Phone</Label>
                    <Input
                      value={editingUser.phone}
                      onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                      className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Location</Label>
                    <Input
                      value={editingUser.location}
                      onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                      className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Role *</Label>
                    <Select
                      value={editingUser.role}
                      onValueChange={(v) => setEditingUser({ ...editingUser, role: v as any })}
                    >
                      <SelectTrigger className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Status *</Label>
                    <Select
                      value={editingUser.status}
                      onValueChange={(v) => setEditingUser({ ...editingUser, status: v as any })}
                    >
                      <SelectTrigger className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Website</Label>
                    <Input
                      value={editingUser.website}
                      onChange={(e) => setEditingUser({ ...editingUser, website: e.target.value })}
                      className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Avatar URL</Label>
                    <Input
                      value={editingUser.avatar}
                      onChange={(e) => setEditingUser({ ...editingUser, avatar: e.target.value })}
                      className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-sm font-semibold text-foreground">Bio</Label>
                  <textarea
                    value={editingUser.bio}
                    onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })}
                    className="w-full min-h-[80px] bg-background border border-border/50 text-foreground rounded-md px-3 py-2 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
              <DialogFooter className="p-4 border-t border-border/50 bg-muted/20">
                <Button
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  className="hover:bg-muted transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveUser}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save User
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

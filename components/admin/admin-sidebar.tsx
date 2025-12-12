"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Home, Users, BarChart3, FileText, Settings, LifeBuoy, Package, FolderOpen, ShieldCheck, Target } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationGroups = [
  {
    title: "Main",
    items: [
      { page: null, label: "Dashboard", icon: Home },
      { page: "analytics", label: "Analytics", icon: BarChart3 },
    ]
  },
  {
    title: "Management",
    items: [
      { page: "leads", label: "Leads", icon: FileText },
      { page: "contacts", label: "Contacts", icon: Users },
      { page: "products", label: "Products", icon: Package },
      { page: "projects", label: "Projects", icon: FolderOpen },
    ]
  },
  {
    title: "Administration",
    items: [
      { page: "setup", label: "Database Setup", icon: ShieldCheck },
      { page: "users", label: "Team Users", icon: ShieldCheck },
      { page: "legal", label: "Legal Pages", icon: FileText },
      { page: "pixels", label: "Marketing Pixels", icon: Target },
    ]
  }
]

const footerNav = [
  { page: "settings", label: "Settings", icon: Settings },
  { page: "support", label: "Support", icon: LifeBuoy },
]

const NavLink = ({ page, label, icon: Icon }: { page: string | null; label: string; icon: React.ElementType }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = searchParams.get("page")

  const href = page ? `/admin?page=${page}` : "/admin"
  const isActive = page === currentPage && pathname === '/admin'

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "text-charcoal-800 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-800",
        isActive && "bg-gold-50 text-gold-600 dark:bg-gold-500/10 dark:text-gold-400",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )
}

export function AdminSidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("flex flex-col bg-cream-50 dark:bg-charcoal-950 border-r border-cream-200 dark:border-charcoal-800", className)}>
      <div className="flex h-16 items-center justify-center border-b border-gold-500 px-4">
        <Link href="/admin" className="flex items-center gap-3 font-bold text-lg">
          <img src="/top-modern-logo-gold.png" alt="Top Modern" className="h-8 w-auto" />
          <span className="font-serif text-gold-500">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-4 p-4">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-sidebar-accent-foreground/50 tracking-wider">{group.title}</h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink key={item.label} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>
      <nav className="p-4 mt-auto border-t border-sidebar-border space-y-1">
        {footerNav.map((item) => (
          <NavLink key={item.label} {...item} />
        ))}
      </nav>
    </aside>
  )
}

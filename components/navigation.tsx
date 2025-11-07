"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, Mail, Moon, Sun } from "lucide-react"
import { useContactTracking } from "@/components/contact-tracking"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { trackContact } = useContactTracking()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handlePhoneClick = () => {
    trackContact("phone_call", {
      source: "navigation",
      number: "+20 123 456 7890",
    })
    window.location.href = "tel:+201234567890"
  }

  const handleEmailClick = () => {
    trackContact("email_click", {
      source: "navigation",
      email: "info@topmodern.com",
    })
    window.location.href = "mailto:info@topmodern.com"
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/products", label: "Products" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-primary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left Section - Logo */}
            <div className="flex items-center">
              <Link href="/" className="py-0 px-0">
                <img src="/Sticker TOP MODERN.png" alt="Top Modern" className="h-12 md:h-16 w-auto filter brightness-110" />
              </Link>
            </div>

            {/* Center Section - Empty for balance */}
            <div className="flex justify-center">
            </div>

            {/* Right Section - Navigation Links (Desktop) / Single CTA (Mobile) */}
            <div className="flex items-center justify-end gap-4">
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative text-sm font-medium text-white/90 transition-colors hover:text-accent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-500 hover:after:w-full",
                      (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)) && "text-accent after:w-full"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-white hover:bg-white/10 hover:text-accent"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              {/* Mobile single CTA */}
              <div className="md:hidden">
                <Button
                  variant="default"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={handleEmailClick}
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isOpen && (
          <div className="fixed inset-0 top-16 bg-black/70 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsOpen(false)}>
            <div className="absolute top-0 left-0 w-full bg-black/80 border-b border-primary/40 py-4">
              <div className="px-2 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-3 py-2 text-base font-medium text-white/90 transition-colors hover:text-accent hover:bg-white/10 rounded-md",
                      (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)) && "text-accent bg-white/10"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col space-y-2 px-3 pt-4">
                  <Button
                    variant="ghost"
                    className="text-white/90 hover:text-accent hover:bg-white/10"
                    onClick={handlePhoneClick}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button
                    variant="default"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleEmailClick}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Get Quote
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={toggleTheme}
                    className="text-white hover:text-accent hover:bg-white/10"
                    title="Toggle theme"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                    Toggle Theme
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>


    </>
  )
}
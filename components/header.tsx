"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface SiteSettings {
  logo: {
    main: string
    footer: string
    admin: string
  }
  contact: {
    phone1: string
    phone2: string
    email1: string
    email2: string
    whatsapp: string
  }
  social: {
    facebook: string
    instagram: string
    linkedin: string
  }
  company: {
    name: string
    description: string
    address: string
  }
}

const defaultSettings: SiteSettings = {
  logo: {
    main: "/top-modern-logo-gold.png",
    footer: "/top-modern-logo-gold.png",
    admin: "/top-modern-logo-gold.png",
  },
  contact: {
    phone1: "+20 123 456 7890",
    phone2: "+971 50 123 4567",
    email1: "info@topmodern.com",
    email2: "sales@topmodern.com",
    whatsapp: "+201234567890",
  },
  social: {
    facebook: "https://facebook.com/topmodern",
    instagram: "https://instagram.com/topmodern",
    linkedin: "https://linkedin.com/company/topmodern",
  },
  company: {
    name: "Top Modern",
    description:
      "Premium marble and granite solutions for luxury real estate, hotels, and restaurants across the MENA region.",
    address: "MENA Region",
  },
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("siteSettings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }

    // Listen for settings updates
    const handleSettingsUpdate = (event: CustomEvent<SiteSettings>) => {
      setSettings(event.detail)
    }

    window.addEventListener("settingsUpdated", handleSettingsUpdate as EventListener)

    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdate as EventListener)
    }
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full border-b border-border/20 transition-all duration-300 ${
        scrolled ? "bg-primary shadow-lg" : "bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/90"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Link href="/" className="flex items-center">
              <img src={settings.logo.main} alt="Top Modern" className="h-16 w-auto" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            variants={navVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:flex md:items-center md:gap-8"
          >
            {navLinks.map((link) => (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  className="relative text-sm font-medium text-white/90 transition-colors hover:text-accent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-500 hover:after:w-full"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-accent md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-white/10 md:hidden"
            >
              <div className="flex flex-col gap-4 py-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-white/90 transition-colors hover:text-accent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

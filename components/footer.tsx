"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react"

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

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const currentYear = new Date().getFullYear()

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

  return (
    <footer className="border-t border-border/20 bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={settings.logo.main} alt="Top Modern" className="h-16 w-auto" />
            <p className="text-sm leading-relaxed text-white/70">
              {settings.company.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-white/70 transition-colors hover:text-accent">
                Home
              </Link>
              <Link href="/products" className="text-sm text-white/70 transition-colors hover:text-accent">
                Products
              </Link>
              <Link href="/projects" className="text-sm text-white/70 transition-colors hover:text-accent">
                Projects
              </Link>
              <Link href="/about" className="text-sm text-white/70 transition-colors hover:text-accent">
                About
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">Contact</h4>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${settings.contact.phone1}`}
                className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-accent"
              >
                <Phone className="h-4 w-4" />
                <span>{settings.contact.phone1}</span>
              </a>
              <a
                href={`mailto:${settings.contact.email1}`}
                className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-accent"
              >
                <Mail className="h-4 w-4" />
                <span>{settings.contact.email1}</span>
              </a>
              <div className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>{settings.company.address}</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">Business Hours</h4>
            <div className="space-y-2 text-sm text-white/70">
              <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4">
              {settings.social.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-accent transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings.social.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-accent transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings.contact.whatsapp && (
                <a
                  href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g, '')}?text=Hello!%20I'm%20interested%20in%20your%20marble%20and%20granite%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors"
                  aria-label="Connect through WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">Connect through WhatsApp</span>
                </a>
              )}
            </div>
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
              <p className="text-sm text-white/70">© {currentYear} {settings.company.name}. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="/privacy-policy" className="text-sm text-white/70 transition-colors hover:text-accent">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm text-white/70 transition-colors hover:text-accent">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

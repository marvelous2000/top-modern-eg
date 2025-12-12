"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react"
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation'; // Added import
import { getSafeLocale } from '@/lib/locale-utils'; // Added import

import { SiteSettings, defaultSettings } from "@/lib/types"

export default function Footer() { // Removed isAdmin prop
  const params = useParams(); // Added
  const locale = getSafeLocale(params.locale); // Added

  const t = useTranslations('footer');

  const safeT = (key: string, fallback = key) => {
    try {
      return t(key);
    } catch (e) {
      console.warn(`[Footer] Missing translation: footer.${key}`, e);
      return fallback;
    }
  };

  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    }
  }, [])

  return (
    <footer className="bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={settings.logo.main} alt="Top Modern" className="h-16 w-auto" />
            <p className="text-sm leading-relaxed text-white/70">
              {safeT('company_description', settings.company.description)}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">{safeT('quick_links')}</h4>
            <nav className="flex flex-col gap-2">
              <Link href={`/${locale}`} className="text-sm text-white/70 transition-colors hover:text-accent">
                {safeT('home')}
              </Link>
              <Link href={`/${locale}/products`} className="text-sm text-white/70 transition-colors hover:text-accent">
                {safeT('products')}
              </Link>
              <Link href={`/${locale}/projects`} className="text-sm text-white/70 transition-colors hover:text-accent">
                {safeT('projects')}
              </Link>
              <Link href={`/${locale}/about`} className="text-sm text-white/70 transition-colors hover:text-accent">
                {safeT('about')}
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">{safeT('contact')}</h4>
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
            <h4 className="font-medium text-white">{safeT('business_hours')}</h4>
            <div className="space-y-2 text-sm text-white/70">
              <p>{safeT('monday_friday')}</p>
              <p>{safeT('saturday')}</p>
              <p>{safeT('sunday')}</p>
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
                  aria-label={safeT('connect_whatsapp_aria', 'Connect on WhatsApp')}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">{safeT('connect_whatsapp', 'Connect on WhatsApp')}</span>
                </a>
              )}
            </div>
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
              <p className="text-sm text-white/70">© {currentYear} {settings.company.name}. {safeT('all_rights_reserved', 'All rights reserved.')}</p>
              <div className="flex gap-6">
                <Link href={`/${locale}/privacy-policy`} className="text-sm text-white/70 transition-colors hover:text-accent">
                  {safeT('privacy_policy')}
                </Link>
                <Link href={`/${locale}/terms`} className="text-sm text-white/70 transition-colors hover:text-accent">
                  {safeT('terms_of_service')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

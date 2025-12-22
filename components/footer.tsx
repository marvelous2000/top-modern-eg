"use client";

import { Link } from '@/i18n/navigation';
import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react"
import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation'; // Added import
import { getSafeLocale } from '@/lib/locale-utils'; // Added import

import { SiteSettings, defaultSettings } from "@/lib/types"

export default function Footer() { // Removed isAdmin prop
  const params = useParams(); // Added
  const locale = getSafeLocale(params.locale); // Added

  const t = useTranslation('footer');

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

  // Defensive checks for lucide-react icons to avoid runtime invalid element errors
  const isValidIcon = (icon: any) => typeof icon === 'function' || (typeof icon === 'object' && icon !== null)

  useEffect(() => {
    const icons = { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle }
    Object.entries(icons).forEach(([name, val]) => {
      if (!isValidIcon(val)) {
        console.warn(`[Footer] Icon "${name}" is not a valid React component. It may be missing from 'lucide-react' or incorrectly imported.`)
      }
    })
  }, [])

  return (
    <footer className="bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={settings.logo.main} alt="Top Modern" className="h-16 w-auto" />
            <p className="text-sm leading-relaxed text-white/70">
              {t('company_description', { defaultValue: settings.company.description })}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">{t('quick_links')}</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-white/70 transition-colors hover:text-gold-600">
                <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">{t('home')}</span>
              </Link>
              <Link href="/products" className="text-sm text-white/70 transition-colors hover:text-gold-600">
                <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">{t('products')}</span>
              </Link>
              <Link href="/projects" className="text-sm text-white/70 transition-colors hover:text-gold-600">
                <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">{t('projects')}</span>
              </Link>
              <Link href="/about" className="text-sm text-white/70 transition-colors hover:text-gold-600">
                <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">{t('about')}</span>
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">{t('contact')}</h4>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${settings.contact.phone1}`}
                className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-gold-600"
              >
                {isValidIcon(Phone) ? <Phone className="h-4 w-4" /> : <span className="h-4 w-4 inline-block" />}
                <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">{settings.contact.phone1}</span>
              </a>
              <a
                href={`mailto:${settings.contact.email1}`}
                className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-gold-600"
              >
                {isValidIcon(Mail) ? <Mail className="h-4 w-4" /> : <span className="h-4 w-4 inline-block" />}
                <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">{settings.contact.email1}</span>
              </a>
              <div className="flex items-start gap-2 text-sm text-white/70">
                {isValidIcon(MapPin) ? <MapPin className="h-4 w-4 mt-0.5" /> : <span className="h-4 w-4 inline-block mt-0.5" />}
                <span>{settings.company.address}</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">{t('business_hours')}</h4>
            <div className="space-y-2 text-sm text-white/70">
              <p>{t('monday_friday')}</p>
              <p>{t('saturday')}</p>
              <p>{t('sunday')}</p>
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
                  className="text-white/70 hover:text-gold-600 transition-colors"
                  aria-label="Facebook"
                >
                  {isValidIcon(Facebook) ? <Facebook className="h-5 w-5" /> : <span className="h-5 w-5 inline-block" />}
                </a>
              )}
              {settings.social.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-gold-600 transition-colors"
                  aria-label="Instagram"
                >
                  {isValidIcon(Instagram) ? <Instagram className="h-5 w-5" /> : <span className="h-5 w-5 inline-block" />}
                </a>
              )}
              {settings.contact.whatsapp && (
                <a
                  href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g, '')}?text=Hello!%20I'm%20interested%20in%20your%20marble%20and%20granite%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-gold-600 transition-colors"
                  aria-label={t('connect_whatsapp_aria', { defaultValue: 'Connect on WhatsApp' })}
                >
                    {isValidIcon(MessageCircle) ? <MessageCircle className="h-5 w-5" /> : <span className="h-5 w-5 inline-block" />}
                  <span className="text-sm relative inline-block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">{t('connect_whatsapp', { defaultValue: 'Connect on WhatsApp' })}</span>
                </a>
              )}
            </div>
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
              <p className="text-sm text-white/70">© {currentYear} {settings.company.name}. {t('all_rights_reserved', { defaultValue: 'All rights reserved.' })}</p>
              <div className="flex gap-6">
                <Link href="/privacy-policy" className="text-sm text-white/70 transition-colors hover:text-gold-600">
                  <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">{t('privacy_policy')}</span>
                </Link>
                <Link href="/terms" className="text-sm text-white/70 transition-colors hover:text-gold-600">
                  <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">{t('terms_of_service')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

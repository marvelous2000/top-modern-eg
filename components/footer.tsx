"use client";

import { Link } from '@/i18n/navigation';
import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react"
import { useParams } from 'next/navigation';
import { getSafeLocale } from '@/lib/locale-utils';
import { useTranslation } from '@/app/i18n/client'; // Changed import
import { useSettings } from '@/components/providers/SettingsProvider';

export default function Footer() { 
  const params = useParams();
  const locale = getSafeLocale(params.locale);
  const t = useTranslation('footer');
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear()
  
  const isValidIcon = (icon: any) => typeof icon === 'function' || (typeof icon === 'object' && icon !== null)

  return (
    <footer className="bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={settings.logo.footer || settings.logo.main} alt={settings.company.name || "Top Modern"} className="h-16 w-auto" />
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
              {settings.contact.phone1 && (
                <a
                  href={`tel:${settings.contact.phone1}`}
                  className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-gold-600"
                >
                  {isValidIcon(Phone) ? <Phone className="h-4 w-4" /> : <span className="h-4 w-4 inline-block" />}
                  <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">{settings.contact.phone1}</span>
                </a>
              )}
              {settings.contact.email1 && (
                <a
                  href={`mailto:${settings.contact.email1}`}
                  className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-gold-600"
                >
                  {isValidIcon(Mail) ? <Mail className="h-4 w-4" /> : <span className="h-4 w-4 inline-block" />}
                  <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full">{settings.contact.email1}</span>
                </a>
              )}
              {settings.company.address && (
                <div className="flex items-start gap-2 text-sm text-white/70">
                  {isValidIcon(MapPin) ? <MapPin className="h-4 w-4 mt-0.5" /> : <span className="h-4 w-4 inline-block mt-0.5" />}
                  <span>{settings.company.address}</span>
                </div>
              )}
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

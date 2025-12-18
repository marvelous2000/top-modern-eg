"use client"

import { useState, useEffect } from "react"
import { Menu, X, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "@/components/providers/TranslationsProvider"
import { LanguageSwitcher } from "./language-switcher"
import { useTheme } from "next-themes" // Import useTheme
import { SiteSettings, defaultSettings } from "@/lib/types" // Import SiteSettings and defaultSettings
import Link from 'next/link'
import { usePathname } from 'next/navigation' // Import usePathname
import { cn } from '@/lib/utils' // Import cn


export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const { t } = useTranslations()
  const { theme, setTheme } = useTheme() // Use the useTheme hook
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname(); // Initialize pathname
  useEffect(() => {
    setMounted(true)
  }, [])

  // Variants for desktop navigation (container)
  const navVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Variants for individual navigation items
  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  // Determine locale from pathname and build links with locale prefix
  const locale = pathname ? pathname.split('/')[1] || 'en' : 'en'

  // Define navigation links inside the component
  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("products") },
    { href: "/projects", label: t("projects") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ]

  const withLocale = (href: string) => {
    if (!href || href === '/') return `/${locale}`
    return `/${locale}${href}`
  }

  // ... (rest of useEffects and navLinks)

  return (
    <motion.header
      // ... (header motion.header props)
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Link href={`/${locale}`} className="flex items-center">
              <img src={settings.logo.main} alt="Top Modern" className="h-16 w-auto" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => {
              const localizedHref = withLocale(link.href)
              const isActive = (link.href === '/' && (pathname === `/${locale}` || pathname === `/${locale}/` || pathname === '/')) ||
                               (link.href !== '/' && (pathname === localizedHref || pathname?.startsWith(localizedHref + '/')))
              return (
                <Link
                  key={link.href}
                  href={localizedHref}
                  className={cn(
                    "text-sm font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full",
                    isActive
                      ? "text-gold-500 after:w-full hover:text-gold-600"
                      : "text-white/90 hover:text-gold-600"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <LanguageSwitcher />
            {/* Theme Toggle for Desktop */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-white hover:bg-white/10 hover:text-gold-600"
              aria-label="Toggle theme"
            >
              {/* Avoid rendering theme-specific icons during SSR to prevent hydration mismatch */}
              {mounted ? (theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />) : <Sun className="h-6 w-6" />}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {/* Theme Toggle for Mobile (next to menu button) */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-gold-600"
              aria-label="Toggle theme"
            >
              {mounted ? (theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />) : <Sun className="h-6 w-6" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-gold-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              // ... (mobile nav props)
            >
              <div className="flex flex-col gap-4 py-4">
                {navLinks.map((link, index) => {
                  const localizedHref = withLocale(link.href)
                  const isActive = (link.href === '/' && (pathname === `/${locale}` || pathname === `/${locale}/` || pathname === '/')) ||
                                   (link.href !== '/' && (pathname === localizedHref || pathname?.startsWith(localizedHref + '/')))
                  return (
                    <Link
                      key={link.href}
                      href={localizedHref}
                      className={cn(
                        "text-sm font-medium transition-colors",
                        "relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full",
                        isActive
                          ? "text-gold-500 after:w-full hover:text-gold-600"
                          : "text-white/90 hover:text-gold-600"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                })}
                {/* Theme Toggle for Mobile inside menu */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm font-medium text-white/90 transition-colors hover:text-gold-600"
                    onClick={() => {
                      setTheme(theme === 'dark' ? 'light' : 'dark');
                      setMobileMenuOpen(false); // Close menu after theme change
                    }}
                    aria-label="Toggle theme"
                  >
                    {mounted && theme === 'dark' ? (
                      <>
                        <Sun className="h-5 w-5 mr-2" /> {t('theme.light')}
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5 mr-2" /> {t('theme.dark')}
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

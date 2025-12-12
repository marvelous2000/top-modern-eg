"use client"

import { useState, useEffect } from "react"
import { Menu, X, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "@/components/providers/TranslationsProvider"
import { LanguageSwitcher } from "./language-switcher"
import { useTheme } from "next-themes" // Import useTheme
import { SiteSettings, defaultSettings } from "@/lib/types" // Import SiteSettings and defaultSettings
import Link from "next/link"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const { t } = useTranslations()
  const { theme, setTheme } = useTheme() // Use the useTheme hook

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

  // Define navigation links inside the component
  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("products") },
    { href: "/projects", label: t("projects") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ]

  // ... (rest of useEffects and navLinks)

  return (
    <motion.header
      // ... (header motion.header props)
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
              <motion.div key={link.href} variants={navItemVariants}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-white/90 transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div variants={navItemVariants}>
              <LanguageSwitcher />
            </motion.div>
            {/* Theme Toggle for Desktop */}
            <motion.div variants={navItemVariants}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-white hover:bg-white/10 hover:text-accent"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </Button>
            </motion.div>
          </motion.nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {/* Theme Toggle for Mobile (next to menu button) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-white hover:bg-white/10 hover:text-accent"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-accent"
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
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-white/90 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                {/* Theme Toggle for Mobile inside menu */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm font-medium text-white/90 transition-colors hover:text-accent"
                    onClick={() => {
                      setTheme(theme === 'dark' ? 'light' : 'dark');
                      setMobileMenuOpen(false); // Close menu after theme change
                    }}
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
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

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, Mail } from "lucide-react"
import { useContactTracking } from "@/components/contact-tracking"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { trackContact } = useContactTracking()

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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-primary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center w-full h-16">
            {/* Left Section - CTA Buttons (Desktop) / Hamburger (Mobile) */}
            <div className="flex items-center justify-start">
              <div className="hidden md:flex items-center gap-4">
                <Button
                  variant="glass"
                  className="glass-primary rounded-xl px-6 py-3 font-sans font-semibold"
                  onClick={handlePhoneClick}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button
                  variant="glass"
                  className="glass-primary rounded-xl px-6 py-3 font-sans font-semibold"
                  onClick={handleEmailClick}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Get Quote
                </Button>
              </div>
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="text-foreground hover:text-primary transition-colors">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* Center Section - Logo */}
            <div className="flex justify-center py-0 px-0">
              <a href="/" className="py-0 px-0">
                <img src="/Sticker TOP MODERN.png" alt="Top Modern" className="h-24 w-auto filter brightness-110" />
              </a>
            </div>

            {/* Right Section - Navigation Links (Desktop) / Single CTA (Mobile) */}
            <div className="flex items-center justify-end">
              <div className="hidden md:flex items-center gap-8">
                <a
                  href="/"
                  className="text-foreground hover:text-primary transition-colors font-sans font-medium"
                >
                  Home
                </a>
                <a
                  href="/about"
                  className="text-foreground hover:text-primary transition-colors font-sans font-medium"
                >
                  About
                </a>
                <a
                  href="/services"
                  className="text-foreground hover:text-primary transition-colors font-sans font-medium"
                >
                  Products
                </a>
                <a
                  href="/projects"
                  className="text-foreground hover:text-primary transition-colors font-sans font-medium"
                >
                  Projects
                </a>
                <a
                  href="/contact"
                  className="text-foreground hover:text-primary transition-colors font-sans font-medium"
                >
                  Contact
                </a>
              </div>
              {/* Mobile single CTA */}
              <div className="md:hidden">
                <Button
                  variant="glass"
                  className="glass-primary rounded-xl px-4 py-2 font-sans font-semibold"
                  onClick={handleEmailClick}
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-black/50 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="/" className="block px-3 py-2 text-primary hover:text-primary/80 transition-colors text-base">
                Home
              </a>
              <a
                href="/about"
                className="block px-3 py-2 text-primary hover:text-primary/80 transition-colors text-base"
              >
                About
              </a>
              <a
                href="/services"
                className="block px-3 py-2 text-primary hover:text-primary/80 transition-colors text-base"
              >
                Products
              </a>
              <a
                href="/projects"
                className="block px-3 py-2 text-primary hover:text-primary/80 transition-colors text-base"
              >
                Projects
              </a>
              <a
                href="/contact"
                className="block px-3 py-2 text-primary hover:text-primary/80 transition-colors text-base"
              >
                Contact
              </a>
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border border-primary/30 bg-background/50 backdrop-blur-md shadow-xs hover:bg-primary/10 hover:text-primary-foreground hover:border-primary/50"
                  onClick={handlePhoneClick}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button variant="cta" size="sm" className="bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-md border border-primary/40 text-primary-foreground shadow-xl hover:shadow-primary/50 hover:bg-primary/25 hover:border-primary/60 font-bold" onClick={handleEmailClick}>
                  <Mail className="w-4 h-4 mr-2" />
                  Get Quote
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40 hidden md:block">
        <div className="floating-cta-bridge px-6 py-3 rounded-full animate-fade-in-up animation-delay-800">
          <p className="text-body-sm text-primary font-inter font-medium gold-text-glow">
            ✨ Premium Marble & Granite Solutions for MENA Region
          </p>
        </div>
      </div>
    </>
  )
}

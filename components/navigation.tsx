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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-primary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <a href="/">
                <img src="/top-modern-logo-gold.png" alt="Top Modern" className="h-12 w-auto filter brightness-110" />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="/"
                  className="text-[#d4af37] hover:text-[#c41e3a] transition-colors font-inter font-medium text-base"
                >
                  Home
                </a>
                <a
                  href="/about"
                  className="text-[#d4af37] hover:text-[#c41e3a] transition-colors font-inter font-medium text-base"
                >
                  About
                </a>
                <a
                  href="/services"
                  className="text-[#d4af37] hover:text-[#c41e3a] transition-colors font-inter font-medium text-base"
                >
                  Products
                </a>
                <a
                  href="/#projects"
                  className="text-[#d4af37] hover:text-[#c41e3a] transition-colors font-inter font-medium text-base"
                >
                  Projects
                </a>
                <a
                  href="/contact"
                  className="text-[#d4af37] hover:text-[#c41e3a] transition-colors font-inter font-medium text-base"
                >
                  Contact
                </a>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="luxury-button border-primary text-primary hover:bg-primary hover:text-black bg-transparent font-medium"
                onClick={handlePhoneClick}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              <Button size="sm" className="luxury-button cta-button font-medium" onClick={handleEmailClick}>
                <Mail className="w-4 h-4 mr-2" />
                Get Quote
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-primary transition-colors">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-black/50 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="/" className="block px-3 py-2 text-[#d4af37] hover:text-[#c41e3a] transition-colors text-base">
                Home
              </a>
              <a
                href="/about"
                className="block px-3 py-2 text-[#d4af37] hover:text-[#c41e3a] transition-colors text-base"
              >
                About
              </a>
              <a
                href="/services"
                className="block px-3 py-2 text-[#d4af37] hover:text-[#c41e3a] transition-colors text-base"
              >
                Products
              </a>
              <a
                href="/#projects"
                className="block px-3 py-2 text-[#d4af37] hover:text-[#c41e3a] transition-colors text-base"
              >
                Projects
              </a>
              <a
                href="/contact"
                className="block px-3 py-2 text-[#d4af37] hover:text-[#c41e3a] transition-colors text-base"
              >
                Contact
              </a>
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-black bg-transparent"
                  onClick={handlePhoneClick}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button size="sm" className="cta-button" onClick={handleEmailClick}>
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
          <p className="text-sm text-primary font-inter font-medium gold-text-glow">
            ✨ Premium Marble & Granite Solutions for MENA Region
          </p>
        </div>
      </div>
    </>
  )
}

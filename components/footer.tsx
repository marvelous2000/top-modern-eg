"use client"

import { Separator } from "@/components/ui/separator"
import { Facebook, Instagram, Linkedin, MessageCircle, Phone, Mail } from "lucide-react"

export function Footer() {
  const handleContactClick = (type: string, identifier: string) => {
    window.dispatchEvent(
      new CustomEvent("contactClick", {
        detail: { type, identifier, page: "footer" },
      }),
    )
  }

  const handleWhatsAppClick = () => {
    handleContactClick("whatsapp", "+201234567890")
    const message = encodeURIComponent(
      "Hello! I'm interested in your luxury marble and granite solutions. Could you please provide more information?",
    )
    window.open(`https://wa.me/201234567890?text=${message}`, "_blank")
  }

  const handlePhoneClick = () => {
    handleContactClick("phone", "+201234567890")
    window.location.href = "tel:+201234567890"
  }

  const handleEmailClick = () => {
    handleContactClick("email", "info@topmodern.com")
    window.location.href = "mailto:info@topmodern.com"
  }

  const handleSocialClick = (platform: string, url: string) => {
    handleContactClick(`social_${platform}`, url)
    window.open(url, "_blank")
  }

  return (
    <footer className="bg-black/80 backdrop-blur-md border-t border-primary/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <img src="/top-modern-logo-gold.png" alt="Top Modern" className="h-10 w-auto mb-4" />
            <p className="text-gray-300 max-w-md mb-6">
              Premium marble and granite solutions for luxury real estate, hotels, and restaurants across the MENA
              region.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <a
                  href="tel:+201234567890"
                  onClick={handlePhoneClick}
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  +20 123 456 7890
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <a
                  href="mailto:info@topmodern.com"
                  onClick={handleEmailClick}
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  info@topmodern.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <button onClick={handleWhatsAppClick} className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  WhatsApp Business
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-[#d4af37] hover:text-[#c41e3a] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-[#d4af37] hover:text-[#c41e3a] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/services" className="text-[#d4af37] hover:text-[#c41e3a] transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="/projects" className="text-[#d4af37] hover:text-[#c41e3a] transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="/contact" className="text-[#d4af37] hover:text-[#c41e3a] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <a href="/privacy-policy" className="text-[#d4af37] hover:text-[#c41e3a] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-[#d4af37] hover:text-[#c41e3a] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>

            <div>
              <h4 className="font-serif text-sm font-bold text-white mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSocialClick("facebook", "https://facebook.com/topmodern")}
                  className="w-8 h-8 bg-[#d4af37]/20 text-[#d4af37] rounded-full flex items-center justify-center hover:bg-[#c41e3a] hover:text-white transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSocialClick("instagram", "https://instagram.com/topmodern")}
                  className="w-8 h-8 bg-[#d4af37]/20 text-[#d4af37] rounded-full flex items-center justify-center hover:bg-[#c41e3a] hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSocialClick("linkedin", "https://linkedin.com/company/topmodern")}
                  className="w-8 h-8 bg-[#d4af37]/20 text-[#d4af37] rounded-full flex items-center justify-center hover:bg-[#c41e3a] hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-primary/20 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 Top Modern. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">Crafted with excellence in the MENA region</p>
        </div>
      </div>
    </footer>
  )
}

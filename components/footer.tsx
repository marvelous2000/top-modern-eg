import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/20 bg-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <img src="/top-modern-final-logo.png" alt="Top Modern" className="h-16 w-auto" />
            <p className="text-sm leading-relaxed text-white/70">
              Premium natural stone solutions for discerning clients. Crafting timeless elegance with granite, marble,
              and quartz.
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
                href="tel:+1234567890"
                className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-accent"
              >
                <Phone className="h-4 w-4" />
                <span>(123) 456-7890</span>
              </a>
              <a
                href="mailto:info@topmodern.com"
                className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-accent"
              >
                <Mail className="h-4 w-4" />
                <span>info@topmodern.com</span>
              </a>
              <div className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>123 Stone Avenue, Suite 100</span>
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

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-white/70">© {currentYear} Top Modern. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-white/70 transition-colors hover:text-accent">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-white/70 transition-colors hover:text-accent">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

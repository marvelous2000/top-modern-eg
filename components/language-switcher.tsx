"use client"

import { Link } from "@/i18n/navigation" // Use next-intl's Link
import { useTranslations } from '@/app/i18n/client' // Get locale from next-intl client
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { usePathname } from '@/i18n/navigation' // Use next-intl's usePathname

export function LanguageSwitcher() {
  const { locale } = useTranslations() // Get current active locale
  const pathname = usePathname(); // Get current unprefixed pathname from next-intl

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-white/70" />
      <div className="flex gap-1">
        <Link href={pathname} locale="en">
          <Button
            variant={locale === 'en' ? 'secondary' : 'ghost'}
            size="sm"
            className={`text-xs px-2 py-1 h-7 ${
              locale === 'en'
                ? 'bg-accent text-accent-foreground'
                : 'text-white/70 hover:text-gold-600 hover:bg-white/10'
            }`}
          >
            EN
          </Button>
        </Link>
        <Link href={pathname} locale="ar">
          <Button
            variant={locale === 'ar' ? 'secondary' : 'ghost'}
            size="sm"
            className={`text-xs px-2 py-1 h-7 ${
              locale === 'ar'
                ? 'bg-accent text-accent-foreground'
                : 'text-white/70 hover:text-gold-600 hover:bg-white/10'
            }`}
          >
            العربية
          </Button>
        </Link>
      </div>
    </div>
  )
}

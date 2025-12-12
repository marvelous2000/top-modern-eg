"use client"

import Link from "next/link"
import { useTranslations } from "@/components/providers/TranslationsProvider"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { locale } = useTranslations()

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-white/70" />
      <div className="flex gap-1">
        <Link href="/en">
          <Button
            variant={locale === 'en' ? 'secondary' : 'ghost'}
            size="sm"
            className={`text-xs px-2 py-1 h-7 ${
              locale === 'en'
                ? 'bg-accent text-accent-foreground'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            EN
          </Button>
        </Link>
        <Link href="/ar">
          <Button
            variant={locale === 'ar' ? 'secondary' : 'ghost'}
            size="sm"
            className={`text-xs px-2 py-1 h-7 ${
              locale === 'ar'
                ? 'bg-accent text-accent-foreground'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            العربية
          </Button>
        </Link>
      </div>
    </div>
  )
}

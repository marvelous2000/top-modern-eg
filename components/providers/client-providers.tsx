'use client'

import { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from '@/components/theme-provider'

interface ClientProvidersProps {
  children: ReactNode
  locale: string
  messages: any
}

export function ClientProviders({ children, locale, messages }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  )
}

import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles - reduced padding for minimal look
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full min-w-0 rounded-lg bg-white border border-gray-300 text-gray-900 transition-all duration-300 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 px-3 py-2 text-sm shadow-sm focus:shadow-md',
        // Dark mode
        'dark:bg-charcoal-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500',
        // Focus states
        'focus:ring-2 focus:ring-gold-500 focus:border-transparent',
        // Error states
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        // Admin panel LuxAdmin styles - minimal sizing
        'admin-panel:bg-background admin-panel:border-border admin-panel:text-foreground admin-panel:placeholder:text-muted-foreground admin-panel:focus:ring-ring admin-panel:focus:ring-offset-2 admin-panel:px-3 admin-panel:py-2 admin-panel:text-sm admin-panel:h-10',
        className,
      )}
      {...props}
    />
  )
}

export { Input }

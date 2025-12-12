import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles - reduced padding and height for minimal look
        'placeholder:text-muted-foreground flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none',
        // Dark mode
        'dark:bg-charcoal-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500',
        // Focus states
        'focus:ring-2 focus:ring-gold-500 focus:border-transparent',
        // Error states
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        // Admin panel LuxAdmin styles - minimal sizing
        'admin-panel:bg-background admin-panel:border-border admin-panel:text-foreground admin-panel:placeholder:text-muted-foreground admin-panel:focus:ring-ring admin-panel:focus:ring-offset-2 admin-panel:px-3 admin-panel:py-2 admin-panel:text-sm admin-panel:min-h-[80px]',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }

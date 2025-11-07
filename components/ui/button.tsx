import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive admin-button-hover",
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-foreground hover:bg-accent/90 active:scale-95 shadow-sm hover:shadow-md',
        primary: 'bg-accent text-accent-foreground border-0 hover:bg-accent/90 active:scale-95 shadow-sm hover:shadow-md',
        secondary: 'bg-secondary text-secondary-foreground border-0 hover:bg-secondary/80 active:scale-95 shadow-sm hover:shadow-md',
        outline: 'border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent active:scale-95 shadow-sm hover:shadow-md',
        ghost: 'bg-transparent text-muted-foreground border-0 hover:bg-accent/10 hover:text-accent active:scale-95',
        destructive: 'bg-destructive text-destructive-foreground border-0 hover:bg-destructive/90 active:scale-95 shadow-sm hover:shadow-md',
        link: 'text-accent underline-offset-4 hover:underline hover:text-accent/80',
        glass: 'bg-card/80 backdrop-blur-sm border border-accent/20 hover:border-accent/40 text-foreground hover:shadow-accent/10 transition-all duration-300 shadow-sm',
        luxury: 'bg-gradient-to-r from-accent to-accent/90 text-accent-foreground hover:from-accent/90 hover:to-accent shadow-lg hover:shadow-xl border border-accent/20',
      },
      size: {
        sm: 'h-8 px-3 py-1 text-xs rounded-md gap-1.5 has-[>svg]:px-2.5',
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        lg: 'h-12 px-8 py-3 text-base rounded-md has-[>svg]:px-6',
        xl: 'h-14 px-10 py-4 text-lg rounded-md has-[>svg]:px-8',
        icon: 'size-10',
        'icon-sm': 'size-8',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

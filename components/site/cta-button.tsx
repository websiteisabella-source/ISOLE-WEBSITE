import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'coral' | 'outline' | 'ink'

const variants: Record<Variant, string> = {
  coral:
    'border border-coral bg-coral text-primary-foreground shadow-[0_0.9rem_2rem_rgba(241,86,58,0.18)] hover:border-lavender hover:bg-lavender',
  ink: 'bg-ink text-cream hover:bg-ink/90 border border-ink',
  outline:
    'border border-coral/45 bg-transparent text-coral hover:border-coral hover:bg-coral hover:text-primary-foreground',
}

type BaseProps = {
  variant?: Variant
  children: ReactNode
  className?: string
}

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] transition-all duration-500 ease-luxe'

export function CtaLink({
  variant = 'coral',
  children,
  className,
  ...props
}: BaseProps & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(baseClass, variants[variant], className)} {...props}>
      {children}
    </Link>
  )
}

export function CtaButton({
  variant = 'coral',
  children,
  className,
  ...props
}: BaseProps & ComponentProps<'button'>) {
  return (
    <button className={cn(baseClass, variants[variant], className)} {...props}>
      {children}
    </button>
  )
}

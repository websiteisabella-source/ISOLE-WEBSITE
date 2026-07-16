import type { SVGProps } from 'react'

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z" />
      <path d="M8.6 8.4c-.2 0-.5 0-.7.3-.2.3-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.6 4 3.5 2 .8 2.4.7 2.9.6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.2l-1.7-.8c-.2-.1-.4-.1-.6.1l-.6.8c-.1.1-.3.2-.5.1a5 5 0 0 1-2.6-2.3c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4Z" />
    </svg>
  )
}

export function HeartSunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20.3c-.4 0-.7-.1-1-.4C7.6 17 3.5 13.6 3.5 9.2A4.2 4.2 0 0 1 12 7.1a4.2 4.2 0 0 1 8.5 2.1c0 4.4-4.1 7.8-7.5 10.7-.3.3-.6.4-1 .4Z" />
      <circle cx="12" cy="10" r="2" />
      <path d="M12 5.7v1.1M12 13.2v1.1M7.8 10h1.1M15.1 10h1.1M9 7l.8.8M14.2 12.2l.8.8M15 7l-.8.8M9.8 12.2 9 13" />
    </svg>
  )
}

export function FlowerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="2.4" />
      <path d="M12 9.6c.6-2.4-.4-4.6-1.2-5.3-.8.7-1.8 2.9-1.2 5.3M12 14.4c-.6 2.4.4 4.6 1.2 5.3.8-.7 1.8-2.9 1.2-5.3M9.6 12c-2.4-.6-4.6.4-5.3 1.2.7.8 2.9 1.8 5.3 1.2M14.4 12c2.4.6 4.6-.4 5.3-1.2-.7-.8-2.9-1.8-5.3-1.2" />
    </svg>
  )
}

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  )
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="16.4" cy="7.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  )
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

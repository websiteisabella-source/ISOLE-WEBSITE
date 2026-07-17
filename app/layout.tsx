import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Quicksand } from 'next/font/google'
import localFont from 'next/font/local'
import { SITE_NAME } from '@/lib/site'
import './globals.css'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif-app',
  display: 'swap',
})

const sans = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans-app',
  display: 'swap',
})

const tanPearl = localFont({
  src: './fonts/TAN-Pearl-Regular.woff2',
  variable: '--font-tan-pearl',
  weight: '400',
  style: 'normal',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
  preload: true,
})

const poetry = localFont({
  src: './fonts/Poetry-of-Silence.ttf',
  variable: '--font-poetry',
  weight: '400',
  style: 'normal',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
  preload: true,
})

export const metadata: Metadata = {
  title: `${SITE_NAME} | Digital Showroom`,
  description:
    'ISOLÉ is a digital showroom and interactive lookbook. Romantic, bold and elegant pieces made to be felt. Visit our store or reach us on WhatsApp.',
  icons: {
    icon: [
      { url: '/favicon.png?v=transparent', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png?v=transparent', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png?v=transparent', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: `${SITE_NAME} | Digital Showroom`,
    description:
      'An editorial lookbook of romantic, elegant and natural pieces. Discover the collection.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fbf5ec',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`bg-background ${serif.variable} ${sans.variable}`}
    >
      <body
        className={`${tanPearl.variable} ${poetry.variable} font-sans antialiased`}
      >
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

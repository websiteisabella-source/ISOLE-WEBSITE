import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Quicksand } from 'next/font/google'
import localFont from 'next/font/local'
import {
  HOME_DESCRIPTION,
  HOME_KEYWORDS,
  HOME_TITLE,
  OG_IMAGE,
  organizationJsonLd,
  websiteJsonLd,
  jsonLdScript,
} from '@/lib/seo'
import { absoluteUrl, SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

const sans = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans-app',
  display: 'swap',
})

const tanPearl = localFont({
  src: './fonts/TAN-Pearl-Regular.woff2',
  variable: '--font-tan-pearl-local',
  weight: '400',
  style: 'normal',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
  preload: true,
})

const poetry = localFont({
  src: './fonts/Poetry-of-Silence.ttf',
  variable: '--font-poetry-local',
  weight: '400',
  style: 'normal',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  keywords: HOME_KEYWORDS,
  alternates: {
    canonical: absoluteUrl('/'),
  },
  category: 'fashion',
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
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: absoluteUrl('/'),
    siteName: SITE_NAME,
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} showroom de ropa femenina natural`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE],
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
      className={`bg-background ${sans.variable}`}
    >
      <body
        className={`${tanPearl.variable} ${poetry.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(organizationJsonLd)}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(websiteJsonLd)}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

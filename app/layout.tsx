import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

// Cabinet Grotesk is a Fontshare-exclusive font — not available on Google Fonts.
// Plus Jakarta Sans is the closest geometric grotesque on Google Fonts.
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'hashdotstudios — Web Design & Development',
  description:
    'High-performance, beautifully crafted websites for small and medium businesses. Premium engineering without agency pricing or agency timelines.',
  keywords: ['web design', 'web development', 'Next.js', 'Johannesburg', 'South Africa'],
  authors: [{ name: 'hashdotstudios' }],
  openGraph: {
    title: 'hashdotstudios — Web Design & Development',
    description:
      'High-performance, beautifully crafted websites for small and medium businesses.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="site-wrapper bg-brand-base text-brand-primary font-body">
        {children}
      </body>
    </html>
  )
}

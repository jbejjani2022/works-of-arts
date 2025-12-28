import { Inter } from 'next/font/google'
import { generateMetadata as genMetadata } from '@/lib/metadata'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata = genMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body className={`${inter.className} bg-white text-black antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

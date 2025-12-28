import { Inter } from 'next/font/google'
import { generateMetadata as genMetadata } from '@/lib/metadata'
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
    <html lang="en">
      <body className={`${inter.className} bg-white text-black antialiased`}>
        {children}
      </body>
    </html>
  )
}

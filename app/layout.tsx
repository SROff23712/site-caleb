import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RABYMN LOCATION - Location de matériel de mariage',
  description: 'Location de matériel de mariage - RABYMN LOCATION',
  verification: {
    google: 'ZlhiLPerpxbp6z0KG2_Vi54lHeeiYQVX4gQjtWDm0Uk',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}


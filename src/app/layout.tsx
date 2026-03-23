import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Homagio — Your Home, Fully Understood',
  description: 'Catalog every detail. Track every dollar. Discover every possibility. Homagio is the digital brain your home has always deserved.',
  keywords: 'home catalog, materials tracking, renovation budget, home intelligence, digital twin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

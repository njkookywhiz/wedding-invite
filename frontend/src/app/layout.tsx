import './globals.css'
import type { Metadata } from 'next'
import { Playfair_Display, Lato, Alex_Brush, Yatra_One } from 'next/font/google'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif',
})

const lato = Lato({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
})

const alexBrush = Alex_Brush({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
})

const yatraOne = Yatra_One({
  weight: '400',
  subsets: ['devanagari'],
  variable: '--font-hindi',
})

export const metadata: Metadata = {
  title: 'Ankita & Neeraj | Wedding Invitation',
  description: 'Join us to celebrate the wedding of Ankita & Neeraj',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${alexBrush.variable} ${yatraOne.variable}`}>
      <body className="font-sans antialiased text-orange-950">{children}</body>
    </html>
  )
}

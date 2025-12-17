import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Референт - переводчик с использованием ИИ',
  description: 'Референт - переводчик с использованием ИИ для анализа англоязычных статей',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}


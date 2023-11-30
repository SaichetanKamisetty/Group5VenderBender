import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/providers/modalProvider'
import { ToastProvider } from '@/providers/toastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vender Benders',
  description: 'Made for CPSC 362 Project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>

      <html lang="en">
        <body className={inter.className}>
          <ToastProvider/>
          <ModalProvider/>
          {children}
          </body>
      </html>
    </ClerkProvider>
  )
}

import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import './globals.css'
import { SubscriptionInit } from '@/components/SubscriptionInit'

const bricolage = Bricolage_Grotesque({
    variable: '--font-bricolage',
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: 'Eduvoice.ai',
    description: 'Real-time AI Teaching Platform'
}

export default async function RootLayout({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider appearance={{ variables: { colorPrimary: '#fe5933' } }}>
            <html lang="es">
                <body className={`${bricolage.variable} antialiased`}>
                    <SubscriptionInit />
                    <Navbar />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}

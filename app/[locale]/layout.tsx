import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { routing } from '@/i18n/routing'
import Navbar from '@/components/Navbar'
import '../globals.css'

const bricolage = Bricolage_Grotesque({
    variable: '--font-bricolage',
    subsets: ['latin']
})

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
    title: 'Conversa',
    description: 'Real-time AI Teaching Platform'
}

export default async function RootLayout({
    children,
    params
}: {
    children: ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params

    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }

    setRequestLocale(locale)

    return (
        <ClerkProvider appearance={{ variables: { colorPrimary: '#fe5933' } }}>
            <html lang={locale}>
                <body className={`${bricolage.variable} antialiased`}>
                    <NextIntlClientProvider>
                        <Navbar />
                        {children}
                    </NextIntlClientProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}

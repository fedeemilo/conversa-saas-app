import { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { esES } from '@clerk/localizations'

const bricolage = Bricolage_Grotesque({
	variable: '--font-bricolage',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: 'EduVoice - Aprende hablando con IA',
	description:
		'Mejorá tus habilidades con tutores interactivos por voz. Transcripción, resúmenes y más.',
	keywords: ['educación', 'voz', 'IA', 'tutores virtuales', 'resumen de clases'],
	icons: {
		icon: '/favicon.ico',
		apple: '/icons/icon-192x192.png'
	},
	manifest: '/manifest.json',
	openGraph: {
		title: 'EduVoice',
		description: 'Tu plataforma para aprender conversando con tutores inteligentes.',
		url: 'https://eduvoice.app',
		siteName: 'EduVoice',
		images: [
			{
				url: 'https://eduvoice.ai/og-image.png',
				width: 1200,
				height: 630,
				alt: 'EduVoice'
			}
		],
		locale: 'es_AR',
		type: 'website'
	},
	twitter: {
		card: 'summary_large_image',
		site: '@eduvoice',
		creator: '@eduvoice'
	}
}

export const viewport: Viewport = {
	themeColor: '#4007a2'
}

export default async function RootLayout({ children }: { children: ReactNode }) {
	return (
		<ClerkProvider appearance={{ variables: { colorPrimary: '#4007a2' } }} localization={esES}>
			<html lang='es'>
				<body className={`${bricolage.variable} antialiased`}>
					<Navbar />
					{children}
					<Toaster />
				</body>
			</html>
		</ClerkProvider>
	)
}

export const subjects = ['maths', 'language', 'science', 'history', 'coding', 'economics']

export const subjectsColors = {
	science: '#D6F5E3',
	maths: '#FFF3B0',
	language: '#D0E1FF',
	coding: '#FBD0D9',
	history: '#FAE6C8',
	economics: '#D9F0FF'
}

interface Plan {
	id: 'pro' | 'free'
	name: string
	price: string
	features: string[]
	cta: string
	highlight?: boolean
}

export const plans: Plan[] = [
	{
		id: 'free',
		name: 'Plan Básico',
		price: 'Gratis',
		features: [
			'10 conversaciones por mes',
			'3 tutores activos',
			'Transcripción en vivo',
			'Podés generar hasta 10 resúmenes'
		],
		cta: 'Empezar Gratis',
		highlight: false
	},
	{
		id: 'pro',
		name: 'Plan Pro',
		price: '$4900 ARS / mes',
		features: [
			'Conversaciones ilimitadas',
			'10 tutores activos',
			'Transcripción en vivo',
			'Generación de resúmenes ilimitada',
			'Descarga de conversaciones (PDF/MP3)',
			'Historial completo de conversaciones'
		],
		cta: 'Mejorar al Pro',
		highlight: true
	}
]

export const PLANS = {
	FREE: 'free',
	PRO: 'pro'
} as const

export const COMPANION_LIMITS: Record<string, number> = {
	[PLANS.FREE]: 3,
	[PLANS.PRO]: 10
}

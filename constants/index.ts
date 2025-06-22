export const subjects = [
	'maths',
	'language',
	'science',
	'history',
	'coding',
	'economics',
	'art',
	'electronics',
	'health',
	'geography',
	'philosophy'
]

export const subjectsColors = {
	science: '#00DFA2', // Verde turquesa brillante - vida, ciencia
	maths: '#FFD600', // Amarillo intenso - lógica, foco
	language: '#3D8BFF', // Azul medio - comunicación, claridad
	coding: '#FF3C78', // Rosa neón fuerte - energía, tech creativa
	history: '#FF8A00', // Naranja vibrante - historia, épocas
	economics: '#00C2FF', // Celeste puro - finanzas, datos
	art: '#D94AFF', // Magenta fuerte - arte, expresión
	electronics: '#1AC8FF', // Cian eléctrico - circuitos, tecnología
	health: '#00C97B', // Verde médico saturado - salud, vitalidad
	geography: '#FFA133', // Naranja cálido tierra - mapas, tierra
	philosophy: '#A259FF' // Violeta intenso - introspección
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

export const SUMMARY_LIMITS: Record<string, number> = {
	[PLANS.FREE]: 10,
	[PLANS.PRO]: Infinity
}

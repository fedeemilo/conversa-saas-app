export const subjects = ['maths', 'language', 'science', 'history', 'coding', 'economics']

export const subjectsColors = {
    science: '#D6F5E3', // Verde menta suave - moderno y fresco
    maths: '#FFF3B0', // Amarillo pastel cálido - concentrado pero amigable
    language: '#D0E1FF', // Celeste sereno - relajante, comunica claridad
    coding: '#FBD0D9', // Rosa coralado - creativo, ideal para tech sin ser infantil
    history: '#FAE6C8', // Crema cálido - tipo pergamino, muy temático
    economics: '#D9F0FF' // Azul hielo con onda fintech moderna
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
        features: ['10 conversaciones por mes', '3 tutores activos', 'Transcripción en vivo'],
        cta: 'Empezar Gratis',
        highlight: false
    },
    {
        id: 'pro',
        name: 'Plan Pro',
        price: '$2900 ARS / mes',
        features: [
            'Conversaciones ilimitadas',
            '10 tutores activos',
            'Historial de sesiones',
            'Resúmenes avanzados',
            'Reportes de progreso mensual'
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

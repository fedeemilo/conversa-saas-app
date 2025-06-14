export const subjects = ['maths', 'language', 'science', 'history', 'coding', 'economics']

export const subjectsColors = {
    science: '#E5D0FF',
    maths: '#FFDA6E',
    language: '#BDE7FF',
    coding: '#FFC8E4',
    history: '#FFECC8',
    economics: '#C8FFDF'
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
        features: ['10 conversaciones por mes', '3 tutores activos', 'Resúmenes básicos de sesión'],
        cta: 'Empezar Gratis',
        highlight: false
    },
    {
        id: 'pro',
        name: 'Plan Pro',
        price: '$2900 ARS / mes',
        features: [
            'Conversaciones ilimitadas',
            'Tutores ilimitados',
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

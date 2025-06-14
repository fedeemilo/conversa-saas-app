'use server'

import { auth } from '@clerk/nextjs/server'

export const createCheckoutLink = async () => {
    const { userId } = await auth()
    if (!userId) throw new Error('Not authenticated')

    const res = await fetch(`${process.env.BASE_URL}/api/checkout`, {
        method: 'POST',
        body: JSON.stringify({
            userId,
            planName: 'Pro',
            price: 2900
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    console.log({ res })

    if (!res.ok) {
        let message = 'Failed to create checkout preference'
        try {
            const error = await res.json()
            message = error.message || message
        } catch (e) {
            console.error('No se pudo parsear el error como JSON:', e)
        }

        throw new Error(message)
    }

    const data = await res.json()
    return data.url as string
}

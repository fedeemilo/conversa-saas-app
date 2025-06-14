'use server'

import { auth } from '@clerk/nextjs/server'
import mercadopago from 'mercadopago'
import { PLANS } from '@/constants'

export const createCheckoutLink = async () => {
    const { userId } = await auth()
    if (!userId) throw new Error('Not authenticated')

    const res = await fetch(`${process.env.BASE_URL}/api/checkout`, {
        method: 'POST',
        body: JSON.stringify({
            userId,
            planName: PLANS.PRO,
            price: 2900
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

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

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN!
})

export async function downgradeToFree() {
    const { userId } = await auth()
    if (!userId) throw new Error('No autenticado')

    try {
        // 1. Obtener email desde Clerk
        const clerkRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`
            }
        })

        const clerkUser = await clerkRes.json()
        const payerEmail = clerkUser.email_addresses?.[0]?.email_address

        if (!payerEmail) throw new Error('No se encontró el email')

        // 2. Buscar suscripción activa
        const searchRes = await fetch(
            `https://api.mercadopago.com/preapproval/search?payer_email=${payerEmail}&status=authorized`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN!}`
                }
            }
        )

        const result = await searchRes.json()
        const mostRecent = result.results?.[0]

        if (!mostRecent) {
            console.warn(`⚠️ No hay suscripción activa para ${payerEmail}`)
            return
        }

        const preapprovalId = mostRecent.id

        // 3. Cancelar suscripción usando la API REST (PUT)
        const cancelRes = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN!}`
            },
            body: JSON.stringify({ status: 'cancelled' })
        })

        if (!cancelRes.ok) {
            const err = await cancelRes.json()
            console.error('❌ Falló la cancelación:', err)
            throw new Error(err.message || 'No se pudo cancelar la suscripción')
        }

        console.log(
            `✅ Usuario ${userId} (${payerEmail}) pasó a plan Free (cancelado correctamente)`
        )
    } catch (err: any) {
        console.error('❌ Error en downgradeToFree:', err.message)
        throw new Error(err.message)
    }
}

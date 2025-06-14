import mercadopago from 'mercadopago'
import { NextRequest } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN!
})

export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const topic = searchParams.get('topic') || searchParams.get('type')

    if (topic !== 'payment') return Response.json({ status: 'ignored' })

    const paymentId = searchParams.get('id') || searchParams.get('data.id')
    const payment = await mercadopago.payment.findById(Number(paymentId))

    const { userId, planName } = payment.body.metadata || {}

    if (payment.body.status === 'approved' && userId) {
        const supabase = createSupabaseClient()
        await supabase
            .from('subscriptions')
            .update({
                plan: planName.toLowerCase(),
                status: 'active',
                payment_id: paymentId
            })
            .eq('user_id', userId)
    }

    return Response.json({ status: 'ok' })
}

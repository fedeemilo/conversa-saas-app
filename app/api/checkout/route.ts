import { NextRequest } from 'next/server'
import mercadopago from 'mercadopago'

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN!
})

const BASE_URL = process.env.BASE_URL!

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { userId, planName, price } = body

        const preference = {
            items: [
                {
                    title: `Plan ${planName}`,
                    unit_price: price,
                    quantity: 1
                }
            ],
            auto_return: 'approved',
            back_urls: {
                success: `${BASE_URL}/subscription?status=approved`,
                failure: `${BASE_URL}/subscription?status=failure`,
                pending: `${BASE_URL}/subscription?status=pending`
            },
            notification_url: `${BASE_URL}/api/notify`,
            metadata: {
                userId,
                planName
            }
        } as any

        const response = await mercadopago.preferences.create(preference)
        return Response.json({ url: response.body.init_point })
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 })
    }
}

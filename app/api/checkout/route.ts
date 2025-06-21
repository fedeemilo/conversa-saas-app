import { NextRequest } from 'next/server'
import mercadopago from 'mercadopago'

mercadopago.configure({
	access_token: process.env.MP_ACCESS_TOKEN!
})

const BASE_URL = process.env.BASE_URL!

function formatDateForMP(date: Date): string {
	return date.toISOString().replace('Z', '-03:00')
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const { userId, planName, price } = body

		const clerkRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
			headers: {
				Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`
			}
		})

		if (!clerkRes.ok) {
			return new Response(
				JSON.stringify({ message: 'No se pudo obtener el email del usuario' }),
				{
					status: 500
				}
			)
		}

		const clerkUser = await clerkRes.json()
		const payerEmail = clerkUser.email_addresses?.[0]?.email_address

		if (!payerEmail) {
			return new Response(JSON.stringify({ message: 'Email del usuario no encontrado' }), {
				status: 400
			})
		}

		const startDate = formatDateForMP(new Date())
		const endDate = formatDateForMP(
			new Date(new Date().setFullYear(new Date().getFullYear() + 5))
		)

		const preapproval = {
			reason: `Suscripción mensual al plan ${planName}`,
			auto_recurring: {
				frequency: 1,
				frequency_type: 'months',
				transaction_amount: price,
				currency_id: 'ARS',
				start_date: startDate,
				end_date: endDate
			},
			back_url: `${BASE_URL}/subscription?status=approved`,
			external_reference: JSON.stringify({ userId, planName }),
			payer_email: payerEmail
		} as any

		const response = await mercadopago.preapproval.create(preapproval)
		const initPoint = response.body.init_point

		return Response.json({ url: initPoint })
	} catch (error: any) {
		console.error('❌ Error en /api/checkout:', error)
		return new Response(JSON.stringify({ message: error.message }), { status: 500 })
	}
}

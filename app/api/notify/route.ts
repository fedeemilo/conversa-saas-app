import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { createSupabaseClient } from '@/lib/supabase'

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!
const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
	try {
		const rawBody = await req.text()
		const signature = req.headers.get('x-signature')
		const supabase = createSupabaseClient()

		// ✅ Verificación HMAC-SHA256
		const expectedSignature = crypto
			.createHmac('sha256', MP_WEBHOOK_SECRET)
			.update(rawBody)
			.digest('hex')

		if (signature !== expectedSignature) {
			console.warn('⚠️ Firma inválida')
			return new Response('Unauthorized', { status: 401 })
		}

		const body = JSON.parse(rawBody)
		console.log('✅ Webhook recibido:', body)

		// 🧭 Validar acción para preapproval
		if (body.action === 'preapproval.created' || body.action === 'preapproval.authorized') {
			const preapprovalId = body.data.id

			// 🔍 Consultar preapproval real
			const res = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
				headers: {
					Authorization: `Bearer ${MP_ACCESS_TOKEN}`
				}
			})
			const preapproval = await res.json()
			console.log('✅ Preapproval recuperado:', preapproval)

			if (preapproval.status === 'authorized') {
				const ref = JSON.parse(preapproval.external_reference || '{}')
				const userId = ref.userId

				if (!userId) {
					console.warn('⚠️ userId faltante en external_reference')
					return new Response('Missing user_id', { status: 400 })
				}

				// 📦 Insertar o actualizar suscripción
				const { error } = await supabase.from('subscriptions').upsert(
					{
						user_id: userId,
						plan: 'pro',
						status: 'active',
						updated_at: new Date().toISOString()
					},
					{ onConflict: 'user_id' }
				)

				if (error) {
					console.error('❌ Error al guardar en Supabase:', error)
					return new Response('Supabase error', { status: 500 })
				}
			}
		}

		return new Response('OK', { status: 200 })
	} catch (e) {
		console.error('❌ Error al procesar webhook:', e)
		return new Response('Internal Server Error', { status: 500 })
	}
}

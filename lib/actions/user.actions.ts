import { auth } from '@clerk/nextjs/server'
import mercadopago from 'mercadopago'

mercadopago.configure({
	access_token: process.env.MP_ACCESS_TOKEN!
})

export type PlanName = 'free' | 'pro' | null

export const getUserPlan = async (): Promise<PlanName> => {
	const { userId } = await auth()
	if (!userId) return null

	try {
		// 1. Obtenemos el email de Clerk
		const clerkRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
			headers: {
				Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`
			}
		})

		if (!clerkRes.ok) {
			console.error('❌ No se pudo obtener email de Clerk')
			return null
		}

		const clerkUser = await clerkRes.json()
		const payerEmail = clerkUser.email_addresses?.[0]?.email_address

		if (!payerEmail) {
			console.error('❌ Email no disponible')
			return null
		}

		// 2. Buscamos preapprovals activos en MP
		const response = await fetch(
			`https://api.mercadopago.com/preapproval/search?payer_email=${payerEmail}&status=authorized`,
			{
				headers: {
					Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN!}`
				}
			}
		)

		const json = await response.json()
		const subscriptions = json.results || []

		// ⚠️ Filtramos solo los realmente activos
		const active = subscriptions.filter((sub: any) => {
			return (
				sub.status === 'authorized' &&
				sub.auto_recurring?.transaction_amount > 0 &&
				sub.summarized?.pending_charge_quantity > 0
			)
		})

		if (!active.length) return 'free'

		// Ordenamos por fecha de creación
		const mostRecent = active.sort(
			(a: any, b: any) =>
				new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
		)[0]

		let plan = 'free' as PlanName
		try {
			const ref = JSON.parse(mostRecent.external_reference)
			plan = ref.planName?.toLowerCase?.() || 'free'
		} catch (err: any) {
			console.warn('⚠️ No se pudo parsear external_reference:', err.message)
		}

		return plan
	} catch (err: any) {
		console.error('❌ Error al obtener plan del usuario:', err.message)
		return null
	}
}

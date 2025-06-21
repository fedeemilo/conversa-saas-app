'use client'

import { useTransition } from 'react'
import { createCheckoutLink, downgradeToFree } from '@/lib/actions/subscription.actions'
import { useRouter } from 'next/navigation'

interface UpgradeProps {
	setLoading: (loading: boolean) => void
	targetPlan: 'pro' | 'free'
}

export const useUpgradePlan = () => {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const upgrade = ({ setLoading, targetPlan }: UpgradeProps) => {
		startTransition(async () => {
			try {
				if (targetPlan === 'pro') {
					const url = await createCheckoutLink()
					router.push(url)
				} else {
					await downgradeToFree()
					router.push('/')
				}
			} catch (error) {
				console.error('❌ Error al actualizar el plan:', error)
			} finally {
				setLoading(false)
			}
		})
	}

	return { upgrade, isPending }
}

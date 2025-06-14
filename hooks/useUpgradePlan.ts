'use client'

import { useTransition } from 'react'
import { createCheckoutLink } from '@/lib/actions/subscription.actions'
import { useRouter } from 'next/navigation'

export const useUpgradePlan = () => {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const upgrade = () => {
        startTransition(async () => {
            try {
                const url = await createCheckoutLink()
                router.push(url)
            } catch (error) {
                console.error('Error al mejorar al plan Pro:', error)
            }
        })
    }

    return { upgrade, isPending }
}

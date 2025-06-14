'use client'

import { useEffect } from 'react'
import { createDefaultSubscription } from '@/lib/actions/user.actions'

export const SubscriptionInit = () => {
    useEffect(() => {
        createDefaultSubscription().catch((err) =>
            console.error('Failed to initialize subscription:', err)
        )
    }, [])

    return null
}

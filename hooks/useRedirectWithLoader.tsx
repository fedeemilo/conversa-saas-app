'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const useRedirectWithLoader = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleRedirect = (path: string) => {
        setLoading(true)
        router.push(path)
    }

    return {
        loading,
        handleRedirect,
        setLoading
    }
}

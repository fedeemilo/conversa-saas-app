'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import es from '@/messages/es.json'

const SignInLoadingButton = () => {
    const t = es['navbar']
    const router = useRouter()

    const handleClick = () => {
        router.push('/sign-in')
    }

    return (
        <button onClick={handleClick} className="btn-signin relative overflow-hidden">
            <span className="relative z-20">{t.signin}</span>
        </button>
    )
}

export default SignInLoadingButton

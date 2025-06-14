'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'
import { useRedirectWithLoader } from '@/hooks/useRedirectWithLoader'
import es from '@/messages/es.json'

const Cta = () => {
    const t = es['cta']
    const { loading, handleRedirect } = useRedirectWithLoader()

    return (
        <section className="cta-section">
            <div className="cta-badge">{t.badge}</div>
            <h2 className="text-3xl font-bold">{t.title}</h2>
            <p>{t.description}</p>

            <Image src="/images/cta.svg" alt="cta" width={362} height={232} />

            <Button
                className="btn-primary w-full cursor-pointer justify-center"
                onClick={() => handleRedirect('/companions/new')}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        {t.button}
                    </>
                ) : (
                    <>
                        <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
                        <span className="ml-2">{t.button}</span>
                    </>
                )}
            </Button>
        </section>
    )
}

export default Cta

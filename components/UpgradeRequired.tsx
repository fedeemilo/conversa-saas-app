'use client'

import Image from 'next/image'
import es from '@/messages/es.json'
import ButtonWithLoading from '@/components/ButtonWithLoading'

const UpgradeRequired = () => {
    const t = es['companion-new']

    return (
        <article className="companion-limit">
            <Image src="/images/limit.svg" alt="Límite alcanzado" width={350} height={230} />
            <div className="cta-badge">{t.limit_badge}</div>
            <h1>{t.limit_title}</h1>
            <p className="max-w-md text-center leading-relaxed">{t.limit_description}</p>

            <ButtonWithLoading redirectTo={'/subscription'} className="mx-auto max-w-[240px]">
                {t.limit_button}
            </ButtonWithLoading>
        </article>
    )
}

export default UpgradeRequired

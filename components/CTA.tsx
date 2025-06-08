'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const Cta = () => {
    const t = useTranslations('cta')

    return (
        <section className="cta-section">
            <div className="cta-badge">{t('badge')}</div>
            <h2 className="text-3xl font-bold">{t('title')}</h2>
            <p>{t('description')}</p>
            <Image src="/images/cta.svg" alt="cta" width={362} height={232} />
            <button className="btn-primary">
                <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
                <Link href="/companions/new">
                    <p>{t('button')}</p>
                </Link>
            </button>
        </section>
    )
}
export default Cta

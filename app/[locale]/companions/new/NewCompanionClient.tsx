'use client'

import { useTranslations } from 'next-intl'
import CompanionForm from '@/components/CompanionForm'

const NewCompanionClient = () => {
    const t = useTranslations('companion-new')

    return (
        <main className="items-center justify-center min-md:w-2/3 min-lg:w-1/3">
            <article className="flex w-full flex-col gap-4">
                <h1>{t('title')}</h1>
                <p className="text-muted-foreground text-lg">{t('description')}</p>
                <CompanionForm />
            </article>
        </main>
    )
}

export default NewCompanionClient

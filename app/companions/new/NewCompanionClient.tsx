'use client'

import CompanionForm from '@/components/CompanionForm'
import es from '@/messages/es.json'
import UpgradeRequired from '@/components/UpgradeRequired'

const NewCompanionClient = ({ canCreate }: { canCreate: boolean }) => {
    const t = es['companion-new']

    return (
        <main className="items-center justify-center min-md:w-2/3 min-lg:w-1/3">
            {canCreate ? (
                <article className="flex w-full flex-col gap-4">
                    <h1>{t.title}</h1>
                    <p className="text-muted-foreground text-lg">{t.description}</p>
                    <CompanionForm />
                </article>
            ) : (
                <UpgradeRequired />
            )}
        </main>
    )
}

export default NewCompanionClient

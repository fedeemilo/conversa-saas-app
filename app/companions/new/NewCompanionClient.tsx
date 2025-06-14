'use client'

import CompanionForm from '@/components/CompanionForm'
import Image from 'next/image'
import Link from 'next/link'
import es from '@/messages/es.json'

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
                <article className="companion-limit">
                    <Image
                        src="/images/limit.svg"
                        alt="Companion limit reached"
                        width={350}
                        height={230}
                    />
                    <div className="cta-badge">{t.limit_badge}</div>
                    <h1>{t.limit_title}</h1>
                    <p>{t.limit_description}</p>
                    <Link
                        href="/subscription"
                        className="btn-primary w-full justify-center"
                        prefetch={true}
                    >
                        {t.limit_button}
                    </Link>
                </article>
            )}
        </main>
    )
}

export default NewCompanionClient

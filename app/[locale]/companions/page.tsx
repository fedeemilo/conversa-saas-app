import { getAllCompanions } from '@/lib/actions/companion.actions'
import CompanionCard from '@/components/CompanionCard'
import { getSubjectColor } from '@/lib/utils'
import SearchInput from '@/components/SearchInput'
import SubjectFilter from '@/components/SubjectFilter'
import { getTranslations } from 'next-intl/server'

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
    const t = await getTranslations('companions-library')
    const filters = await searchParams
    const subject = filters.subject ?? ''
    const topic = filters.topic ?? ''

    const companions = await getAllCompanions({ subject, topic })

    return (
        <main>
            <section className="flex justify-between gap-4 max-sm:flex-col">
                <h1>{t('title')}</h1>
                <div className="flex gap-4">
                    <SearchInput />
                    <SubjectFilter />
                </div>
            </section>

            <section className="companions-grid">
                {companions.map((companion) => (
                    <CompanionCard
                        key={companion.id}
                        {...companion}
                        color={getSubjectColor(companion.subject)}
                    />
                ))}
            </section>
        </main>
    )
}
export default CompanionsLibrary

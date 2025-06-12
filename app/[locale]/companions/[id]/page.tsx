import { getCompanion } from '@/lib/actions/companion.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getSubjectColor } from '@/lib/utils'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import CompanionSessionSkeleton from '@/components/CompanionSessionSkeleton'
import CompanionClientWrapper from '@/components/CompanionClientWrapper'

interface CompanionSessionPageProps {
    params: Promise<{ id: string; locale: string }>
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
    const { id } = await params

    const companion = await getCompanion(id)
    const user = await currentUser()

    const t = await getTranslations('companion-session')
    const tCompanion = await getTranslations('companion-component')

    if (!user) redirect('/sign-in')
    if (!companion) redirect('/companions')

    const { subject, name, topic, duration } = companion

    return (
        <main>
            <article className="rounded-border flex justify-between p-6 max-md:flex-col">
                <div className="flex items-center gap-2">
                    <div
                        className="flex size-[72px] items-center justify-center rounded-lg max-md:hidden"
                        style={{ backgroundColor: getSubjectColor(subject) }}
                    >
                        <Image src={`/icons/${subject}.svg`} alt={subject} width={35} height={35} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold">{name}</p>
                            <div className="subject-badge max-sm:hidden">{subject}</div>
                        </div>
                        <p className="text-lg">{topic}</p>
                    </div>
                </div>
                <div className="items-center text-2xl max-md:hidden">
                    {duration} {t('minutes')}
                </div>
            </article>
            <Suspense fallback={<CompanionSessionSkeleton />}>
                <CompanionClientWrapper
                    {...companion}
                    companionId={id}
                    userName={user.firstName}
                    userImage={user.imageUrl}
                    translations={{
                        connecting: tCompanion('connecting'),
                        turnOnMic: tCompanion('turn_on_microphone'),
                        turnOffMic: tCompanion('turn_off_microphone'),
                        startSession: tCompanion('start_session'),
                        endSession: tCompanion('end_session')
                    }}
                />
            </Suspense>
        </main>
    )
}
export default CompanionSession

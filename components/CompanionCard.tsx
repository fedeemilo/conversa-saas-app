'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useTranslatedSubject } from '@/lib/subject'

interface CompanionCardProps {
    id: string
    name: string
    topic: string
    subject: string
    duration: number
    color: string
}

const CompanionCard = ({ id, name, topic, subject, duration, color }: CompanionCardProps) => {
    const t = useTranslations()
    const translateSubject = useTranslatedSubject()

    return (
        <article
            className="companion-card flex flex-col justify-between rounded-xl p-4 md:h-79"
            style={{ backgroundColor: color }}
        >
            <div className="flex items-center justify-between">
                <div className="subject-badge">{translateSubject(subject)}</div>
                <button className="companion-bookmark">
                    <Image src={'/icons/bookmark.svg'} alt={'bookmark'} width={12.5} height={15} />
                </button>
            </div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-sm">{topic}</p>

            <div className="flex items-center gap-2">
                <Image src={'/icons/clock.svg'} alt={'duration'} width={13.5} height={13.5} />
                <p className="textsm">
                    {duration} {t('companion-session.minutes')}
                </p>
            </div>

            <div className="mt-auto pt-4">
                <Link href={`/companions/${id}`} className="w-full">
                    <button className="btn-primary w-full justify-center">
                        {t('companion-card.launch')}
                    </button>
                </Link>
            </div>
        </article>
    )
}
export default CompanionCard

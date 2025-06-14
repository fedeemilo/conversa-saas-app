'use client'

import Image from 'next/image'
import { useTranslatedSubject } from '@/lib/subject'
import { removeBookmark, addBookmark } from '@/lib/actions/companion.actions'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'
import { useRedirectWithLoader } from '@/hooks/useRedirectWithLoader'
import es from '@/messages/es.json'

interface CompanionCardProps {
    id: string
    name: string
    topic: string
    subject: string
    duration: number
    color: string
    bookmarked: boolean
}

const CompanionCard = ({
    id,
    name,
    topic,
    subject,
    duration,
    color,
    bookmarked
}: CompanionCardProps) => {
    const tCard = es['companion-card']
    const tSession = es['companion-session']
    const translateSubject = useTranslatedSubject()
    const pathname = usePathname()
    const { loading, handleRedirect } = useRedirectWithLoader()

    const handleBookmark = async () => {
        if (bookmarked) {
            await removeBookmark(id, pathname)
        } else {
            await addBookmark(id, pathname)
        }
    }

    return (
        <article
            className="companion-card flex flex-col justify-between rounded-xl p-4 transition-shadow duration-200 hover:shadow-md md:h-79"
            style={{ backgroundColor: color }}
        >
            <div className="flex items-center justify-between">
                <div className="subject-badge">{translateSubject(subject)}</div>
                <button className="companion-bookmark" onClick={handleBookmark}>
                    <Image
                        src={bookmarked ? '/icons/bookmark-filled.svg' : '/icons/bookmark.svg'}
                        alt="bookmark"
                        width={12.5}
                        height={15}
                    />
                </button>
            </div>

            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-sm">{topic}</p>

            <div className="flex items-center gap-2">
                <Image src="/icons/clock.svg" alt="duration" width={13.5} height={13.5} />
                <p className="text-sm">
                    {duration} {tSession.minutes}
                </p>
            </div>

            <div className="mt-auto pt-4">
                <Button
                    onClick={() => handleRedirect(`/companions/${id}`)}
                    className="w-full cursor-pointer justify-center font-semibold transition"
                >
                    {loading ? (
                        <>
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            {tCard.launch}
                        </>
                    ) : (
                        tCard.launch
                    )}
                </Button>
            </div>
        </article>
    )
}

export default CompanionCard

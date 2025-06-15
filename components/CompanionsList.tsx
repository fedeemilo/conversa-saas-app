'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { cn, getSubjectColor, truncateText } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslatedSubject } from '@/lib/subject'
import es from '@/messages/es.json'

interface CompanionsListProps {
    title?: string
    companions?: Companion[]
    classNames?: string
}

const CompanionsList = ({ title, companions, classNames }: CompanionsListProps) => {
    const t = es['companions-list']
    const translateSubject = useTranslatedSubject()

    return (
        <article className={cn('companion-list', classNames)}>
            <h2 className="text-3xl font-bold">{title}</h2>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-2/3 text-lg">{t.lessons}</TableHead>
                        <TableHead className="text-lg">{t.subject}</TableHead>
                        <TableHead className="text-right text-lg">{t.duration}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {companions?.map(({ id, subject, name, topic, duration }) => (
                        <TableRow key={id}>
                            <TableCell className="font-medium">
                                <Link href={`/companions/${id}`} prefetch={true}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="flex size-[72px] items-center justify-center rounded-lg max-md:hidden"
                                            style={{ backgroundColor: getSubjectColor(subject) }}
                                        >
                                            <Image
                                                src={`/icons/${subject}.svg`}
                                                alt={'subject'}
                                                width={35}
                                                height={35}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-2xl font-bold">{name}</p>
                                            <p className="truncate text-lg" title={topic}>
                                                {truncateText(topic, 50)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell>
                                <div className="subject-badge w-fit max-md:hidden">
                                    {translateSubject(subject)}
                                </div>
                                <div
                                    className="flex w-fit items-center justify-center rounded-lg p-2 md:hidden"
                                    style={{ backgroundColor: getSubjectColor(subject) }}
                                >
                                    <Image
                                        src={`/icons/${subject}.svg`}
                                        alt="subject"
                                        width={18}
                                        height={18}
                                    />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex w-full items-center justify-end gap-2">
                                    <p className="text-2xl">
                                        {duration} <span className="max-md:hidden">{t.mins}</span>
                                    </p>
                                    <Image
                                        src={'/icons/clock.svg'}
                                        alt={'minuted'}
                                        width={14}
                                        height={14}
                                        className="md:hidden"
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </article>
    )
}
export default CompanionsList

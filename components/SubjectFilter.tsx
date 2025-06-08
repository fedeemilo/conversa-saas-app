'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { subjects } from '@/constants'
import useSearchFilter from '@/hooks/useSearchFilter'
import { useTranslations } from 'next-intl'
import { useTranslatedSubject } from '@/lib/subject'

const SubjectFilter = () => {
    const { searchQuery, setSearchQuery } = useSearchFilter({
        filter: 'subject',
        resetValue: 'all'
    })

    const t = useTranslations('subject-filter')
    const translateSubject = useTranslatedSubject()

    return (
        <Select onValueChange={setSearchQuery} value={searchQuery}>
            <SelectTrigger className="input capitalize">
                <SelectValue placeholder={t('placeholder')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className="capitalize">
                        {translateSubject(subject)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default SubjectFilter

'use client'

import { useTranslations } from 'next-intl'

export const useTranslatedSubject = () => {
    const t = useTranslations('subjects')

    return (subject: string) => {
        return t(subject.toLowerCase())
    }
}

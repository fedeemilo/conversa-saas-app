'use client'

import es from '@/messages/es.json'

export const useTranslatedSubject = () => {
	const t = es['subjects'] as any

	return (subject: string) => {
		return t[subject].toLowerCase()
	}
}

import es from '@/messages/es.json'

export const translateSubject = () => {
	const t = es['subjects'] as any

	return (subject: string) => {
		return t[subject].toLowerCase()
	}
}

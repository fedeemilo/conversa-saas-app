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
import { translateSubject } from '@/lib/subject'
import es from '@/messages/es.json'

const SubjectFilter = () => {
	const { searchQuery, setSearchQuery } = useSearchFilter({
		filter: 'subject',
		resetValue: 'all'
	})

	const t = es['subject-filter']
	const translatedSubject = translateSubject()

	return (
		<Select onValueChange={setSearchQuery} value={searchQuery}>
			<SelectTrigger className='input capitalize'>
				<SelectValue placeholder={t.placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='all'>{t.all}</SelectItem>
				{subjects.map((subject) => (
					<SelectItem key={subject} value={subject} className='capitalize'>
						{translatedSubject(subject)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default SubjectFilter

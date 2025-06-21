'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils'

type UseSearchFilterProps = {
	filter: string
	resetValue?: string
	clearOnlyOnPath?: string
	debounceMs?: number
}

const useSearchFilter = ({
	filter,
	resetValue = '',
	clearOnlyOnPath,
	debounceMs = 500
}: UseSearchFilterProps) => {
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()

	const query = searchParams.get(filter) || ''
	const [searchQuery, setSearchQuery] = useState(query)

	useEffect(() => {
		const handler = setTimeout(() => {
			let newUrl = ''

			const shouldClear =
				searchQuery === resetValue ||
				(clearOnlyOnPath && pathname === clearOnlyOnPath && searchQuery === '')

			if (shouldClear) {
				newUrl = removeKeysFromUrlQuery({
					params: searchParams.toString(),
					keysToRemove: [filter]
				})
			} else {
				newUrl = formUrlQuery({
					params: searchParams.toString(),
					key: filter,
					value: searchQuery
				})
			}

			router.push(newUrl, { scroll: false })
		}, debounceMs)

		return () => clearTimeout(handler)
	}, [
		searchQuery,
		searchParams,
		router,
		pathname,
		filter,
		resetValue,
		clearOnlyOnPath,
		debounceMs
	])

	return { searchQuery, setSearchQuery }
}

export default useSearchFilter

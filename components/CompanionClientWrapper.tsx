'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import CompanionSessionSkeleton from './CompanionSessionSkeleton'

const CompanionComponent = dynamic(() => import('./CompanionComponent'), {
	ssr: false
})

const CompanionClientWrapper = (props: CompanionComponentProps) => {
	return (
		<Suspense fallback={<CompanionSessionSkeleton />}>
			<CompanionComponent {...props} />
		</Suspense>
	)
}

export default CompanionClientWrapper

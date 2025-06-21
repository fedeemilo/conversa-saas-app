import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserPlan } from '@/lib/actions/user.actions'
import SubscriptionClient from './SubscriptionClient'

const SubscriptionPage = async () => {
	const { userId } = await auth()
	if (!userId) redirect('/sign-in')

	const plan = await getUserPlan()

	return <SubscriptionClient plan={plan} />
}

export default SubscriptionPage

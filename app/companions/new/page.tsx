import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { newCompanionPermissions } from '@/lib/actions/companion.actions'
import CompanionForm from '@/components/CompanionForm'
import UpgradeRequired from '@/components/UpgradeRequired'
import es from '@/messages/es.json'

const NewCompanionPage = async () => {
	const t = es['companion-new']

	const { userId } = await auth()
	if (!userId) redirect('/sign-in')

	const canCreateCompanion = await newCompanionPermissions()

	return (
		<main className='items-center justify-center min-md:w-2/3 min-lg:w-1/3'>
			{canCreateCompanion ? (
				<article className='flex w-full flex-col gap-4'>
					<h1>{t.title}</h1>
					<p className='text-muted-foreground text-lg'>{t.description}</p>
					<CompanionForm />
				</article>
			) : (
				<UpgradeRequired />
			)}
		</main>
	)
}

export default NewCompanionPage

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import {
	getUserCompanions,
	getUserSessions,
	getBookmarkedCompanions
} from '@/lib/actions/companion.actions'
import Image from 'next/image'
import CompanionsList from '@/components/CompanionsList'
import es from '@/messages/es.json'
import { getUserPlan } from '@/lib/actions/user.actions'
import { PLANS } from '@/constants'
import { Badge } from '@/components/ui/badge'
import { BadgeCheckIcon } from 'lucide-react'
import Link from 'next/link'
import { capitalize } from '@/lib/utils'

const Profile = async () => {
	const user = await currentUser()
	const plan = await getUserPlan()

	if (!user) redirect('/sign-in')

	const companions = await getUserCompanions(user.id)
	const sessionHistory = await getUserSessions(user.id)
	const bookmarkedCompanions = await getBookmarkedCompanions(user.id)

	const t = es['my-journey']

	return (
		<main className='min-lg:w-3/4'>
			<section className='flex items-center justify-between gap-4 max-sm:flex-col'>
				<div className='flex items-center gap-4'>
					<Image src={user.imageUrl} alt={user.firstName!} width={110} height={110} />
					<div className='flex flex-col gap-2'>
						<div className='flex'>
							<h1 className='text-2xl font-bold'>
								{user.firstName} {user.lastName}
							</h1>
							{plan === PLANS.PRO && (
								<Badge
									variant='secondary'
									className='ml-2 bg-violet-900 text-white dark:bg-violet-950'
								>
									<BadgeCheckIcon />
									<Link href={'/subscription'}>{capitalize(plan ?? 'free')}</Link>
								</Badge>
							)}
						</div>

						<p className='text-muted-foreground text-sm'>
							{user.emailAddresses[0].emailAddress}
						</p>
					</div>
				</div>
				<div className='flex gap-4'>
					<div className='flex h-fit flex-col gap-2 rounded-lg border border-black p-4'>
						<div className='flex items-center gap-2'>
							<Image src='/icons/check.svg' alt='checkmark' width={22} height={22} />
							<p className='text-2xl font-bold'>{sessionHistory.length}</p>
						</div>
						<div>{t.lessons_completed}</div>
					</div>
					<div className='flex h-fit flex-col gap-2 rounded-lg border border-black p-4'>
						<div className='flex items-center gap-2'>
							<Image src='/icons/cap.svg' alt='cap' width={22} height={22} />
							<p className='text-2xl font-bold'>{companions.length}</p>
						</div>
						<div>{t.companions_created}</div>
					</div>
				</div>
			</section>
			<Accordion type='multiple'>
				<AccordionItem value='bookmarks'>
					<AccordionTrigger className='text-2xl font-bold'>
						{t.bookmarked_companions} {`(${bookmarkedCompanions.length})`}
					</AccordionTrigger>
					<AccordionContent>
						<CompanionsList companions={bookmarkedCompanions} />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value='recent'>
					<AccordionTrigger className='text-2xl font-bold'>
						{t.recent_sessions}
					</AccordionTrigger>
					<AccordionContent>
						<CompanionsList companions={sessionHistory} />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value='companions'>
					<AccordionTrigger className='text-2xl font-bold'>
						{t.my_companions} {`(${companions.length})`}
					</AccordionTrigger>
					<AccordionContent>
						<CompanionsList companions={companions} />
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</main>
	)
}
export default Profile

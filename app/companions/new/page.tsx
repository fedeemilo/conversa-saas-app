import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import NewCompanionClient from './NewCompanionClient'
import { newCompanionPermissions } from '@/lib/actions/companion.actions'

const NewCompanionPage = async () => {
    const { userId } = await auth()
    if (!userId) redirect('/sign-in')

    const canCreateCompanion = await newCompanionPermissions()

    return <NewCompanionClient canCreate={canCreateCompanion} />
}

export default NewCompanionPage

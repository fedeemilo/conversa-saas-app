import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import NewCompanionClient from './NewCompanionClient'

const NewCompanionPage = async () => {
    const { userId } = await auth()

    if (!userId) redirect('/sign-in')

    return <NewCompanionClient />
}

export default NewCompanionPage

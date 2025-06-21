import { getUserPlan } from '@/lib/actions/user.actions'
import { NextResponse } from 'next/server'

export async function GET() {
	const plan = await getUserPlan()

	return NextResponse.json({ plan })
}

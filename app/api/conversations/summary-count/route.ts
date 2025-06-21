import { NextResponse } from 'next/server'
import { getUserSummaryCount } from '@/lib/actions/conversations.actions'

export async function GET() {
	try {
		const count = await getUserSummaryCount()
		return NextResponse.json({ count })
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}

import { NextResponse } from 'next/server'
import { getLatestConversation } from '@/lib/actions/conversations.actions'

export async function GET() {
	try {
		const data = await getLatestConversation()
		if (!data) {
			return NextResponse.json({ error: 'No conversation found' }, { status: 404 })
		}
		return NextResponse.json(data)
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}

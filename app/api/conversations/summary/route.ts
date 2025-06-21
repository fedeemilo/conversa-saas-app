import { NextResponse } from 'next/server'
import {
	generateSummary,
	getLatestConversation,
	updateConversationSummary
} from '@/lib/actions/conversations.actions'

export async function POST(req: Request) {
	const body = await req.json()
	const { transcript } = body

	const summary = await generateSummary(transcript)
	const latest = await getLatestConversation()

	await updateConversationSummary(latest.id, summary)

	return NextResponse.json({ summary })
}

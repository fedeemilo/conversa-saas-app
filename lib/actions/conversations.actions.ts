'use server'

import { auth } from '@clerk/nextjs/server'
import { createSupabaseClient } from '@/lib/supabase'
import { openai } from '@/lib/openai'

export const saveConversation = async (companionId: string, transcript: string) => {
	const { userId } = await auth()
	const supabase = createSupabaseClient()

	const { data, error } = await supabase.from('conversations').insert({
		user_id: userId,
		companion_id: companionId,
		transcript
	})

	if (error) throw new Error(error.message)

	return data
}

export const generateSummary = async (transcript: string): Promise<string> => {
	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo', // o gpt-4o si está disponible
		messages: [
			{
				role: 'system',
				content:
					'Resumí esta conversación en puntos clave. Usá un estilo educativo y claro.'
			},
			{
				role: 'user',
				content: transcript
			}
		],
		temperature: 0.7
	})

	return response.choices[0].message.content || ''
}

export const updateConversationSummary = async (conversationId: string, summary: string) => {
	const supabase = createSupabaseClient()

	const { error } = await supabase
		.from('conversations')
		.update({ summary })
		.eq('id', conversationId)

	if (error) throw new Error(error.message)
}

export const getLatestConversation = async () => {
	const { userId } = await auth()
	const supabase = createSupabaseClient()

	const { data, error } = await supabase
		.from('conversations')
		.select('id, transcript, summary')
		.eq('user_id', userId)
		.order('created_at', { ascending: false })
		.limit(1)

	if (error) throw new Error(error.message)
	if (!data || data.length === 0) return null

	return data[0]
}

'use server'

import { auth } from '@clerk/nextjs/server'
import { createSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { getUserPlan } from '@/lib/actions/user.actions'
import { startOfMonth, endOfMonth } from 'date-fns'
import { COMPANION_LIMITS, PLANS } from '@/constants'
import { redirect } from 'next/navigation'

// Companions
export const createCompanion = async (formData: CreateCompanion) => {
	const { userId: author } = await auth()
	const supabase = createSupabaseClient()

	const { data, error } = await supabase
		.from('companions')
		.insert({ ...formData, author })
		.select()

	if (error || !data) throw new Error(error?.message || 'Failed to create a companion')

	return data[0]
}

export const getAllCompanions = async ({
	limit = 10,
	page = 1,
	subject,
	topic
}: GetAllCompanions) => {
	const supabase = createSupabaseClient()
	const { userId } = await auth()

	let query = supabase.from('companions').select()

	if (subject && query) {
		query = query
			.ilike('subject', `%${subject}%`)
			.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
	} else if (subject) {
		query = query.ilike('subject', `%${subject}%`)
	} else if (topic) {
		query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
	}

	query = query.range((page - 1) * limit, page * limit - 1)

	const { data: companions, error } = await query

	if (error) throw new Error(error.message)

	if (!userId) {
		return companions.map((c) => ({ ...c, bookmarked: false }))
	}

	const companionIds = companions.map((c) => c.id)

	const { data: bookmarks, error: bookmarksError } = await supabase
		.from('bookmarks')
		.select('companion_id')
		.eq('user_id', userId)
		.in('companion_id', companionIds)

	if (bookmarksError) throw new Error(bookmarksError.message)

	const bookmarkedIds = new Set(bookmarks.map((b) => b.companion_id))

	return companions.map((c) => ({
		...c,
		bookmarked: bookmarkedIds.has(c.id)
	}))
}

export const getCompanion = async (id: string) => {
	const supabase = createSupabaseClient()

	const { data, error } = await supabase.from('companions').select().eq('id', id)

	if (error) return console.log(error)

	return data[0]
}

export const getUserCompanions = async (userId: string) => {
	const supabase = createSupabaseClient()
	const { data, error } = await supabase.from('companions').select().eq('author', userId)

	if (error) throw new Error(error.message)

	return data
}

// Sessions
export const addToSessionHistory = async (companionId: string) => {
	const { userId } = await auth()
	const supabase = createSupabaseClient()
	const { data, error } = await supabase.from('session_history').insert({
		companion_id: companionId,
		user_id: userId
	})

	if (error) throw new Error(error.message)

	return data
}

export const getRecentSessions = async (limit = 10) => {
	const supabase = createSupabaseClient()
	const { data, error } = await supabase
		.from('session_history')
		.select(`companions:companion_id(*)`)
		.order('created_at', { ascending: false })
		.limit(limit)

	if (error) throw new Error(error.message)

	return data.map(({ companions }) => companions)
}

export const getUserSessions = async (userId: string, limit = 10) => {
	const supabase = createSupabaseClient()
	const { data, error } = await supabase
		.from('session_history')
		.select(`companions:companion_id(*)`)
		.eq('user_id', userId)
		.order('created_at', { ascending: false })
		.limit(limit)

	if (error) throw new Error(error.message)

	return data.map(({ companions }) => companions)
}

// Permissions
export const newCompanionPermissions = async (): Promise<boolean> => {
	const { userId } = await auth()
	const supabase = createSupabaseClient()

	if (!userId) return false

	const plan = await getUserPlan()
	const limit = COMPANION_LIMITS[plan ?? ''] ?? 0

	if (limit === 0) return false

	const { count, error } = await supabase
		.from('companions')
		.select('id', { count: 'exact' })
		.eq('author', userId)

	if (error) throw new Error(error.message)

	return (count ?? 0) < limit
}

export const newSessionPermissions = async (): Promise<boolean> => {
	const { userId } = await auth()

	if (!userId) return false

	const plan = await getUserPlan()
	if (plan === PLANS.PRO) return true

	const supabase = createSupabaseClient()

	const now = new Date()
	const from = startOfMonth(now).toISOString()
	const to = endOfMonth(now).toISOString()

	const { count, error } = await supabase
		.from('session_history')
		.select('*', { count: 'exact', head: true })
		.eq('user_id', userId)
		.gte('created_at', from)
		.lte('created_at', to)

	if (error) throw new Error(error.message)

	return (count ?? 0) < 10
}

// Bookmarks
export const addBookmark = async (companionId: string, path: string) => {
	const { userId } = await auth()
	if (!userId) return
	const supabase = createSupabaseClient()
	const { data, error } = await supabase.from('bookmarks').insert({
		companion_id: companionId,
		user_id: userId
	})

	if (error) {
		throw new Error(error.message)
	}

	revalidatePath(path)
	return data
}

export const removeBookmark = async (companionId: string, path: string) => {
	const { userId } = await auth()
	if (!userId) return
	const supabase = createSupabaseClient()

	const { data, error } = await supabase
		.from('bookmarks')
		.delete()
		.eq('companion_id', companionId)
		.eq('user_id', userId)

	if (error) {
		throw new Error(error.message)
	}

	revalidatePath(path)
	return data
}

export const getBookmarkedCompanions = async (userId: string) => {
	const supabase = createSupabaseClient()
	const { data, error } = await supabase
		.from('bookmarks')
		.select(`companions:companion_id (*)`)
		.eq('user_id', userId)
	if (error) {
		throw new Error(error.message)
	}

	return data.map(({ companions }) => companions)
}

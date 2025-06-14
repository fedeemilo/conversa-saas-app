'use server'

import { auth } from '@clerk/nextjs/server'
import { createSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { getUserPlan } from '@/lib/actions/user.actions'

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

export const getUserCompanions = async (userId: string) => {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase.from('companions').select().eq('author', userId)

    if (error) throw new Error(error.message)

    return data
}

export const newCompanionPermissions = async () => {
    const { userId } = await auth()
    const supabase = createSupabaseClient()

    if (!userId) throw new Error('No user ID found')

    const plan = await getUserPlan()

    let limit = 0

    if (plan === 'pro') {
        return true // sin límite
    } else if (plan === 'basic') {
        limit = 3
    } else if (plan === 'premium') {
        limit = 10
    } else {
        // si no tiene plan asignado, no puede crear nada
        return false
    }

    const { data, error } = await supabase
        .from('companions')
        .select('id', { count: 'exact' })
        .eq('author', userId)

    if (error) throw new Error(error.message)

    const companionCount = data?.length ?? 0

    return companionCount < limit
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
    // Revalidate the path to force a re-render of the page
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

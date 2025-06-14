'use server'

import { auth } from '@clerk/nextjs/server'
import { createSupabaseClient } from '@/lib/supabase'
import { PLANS } from '@/constants'

export const createDefaultSubscription = async () => {
    const { userId } = await auth()
    if (!userId) return null

    console.log({ userId })

    const supabase = createSupabaseClient()

    // Verificamos si ya tiene una suscripción
    const { data: existing, error: checkError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(checkError.message)
    }

    if (existing) {
        return existing
    }

    // Crear una nueva suscripción en plan gratuito
    const { data, error } = await supabase
        .from('subscriptions')
        .insert({
            user_id: userId,
            plan: PLANS.FREE,
            status: 'active'
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    return data
}

export const getUserPlan = async () => {
    const { userId } = await auth()
    if (!userId) return null

    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', userId)
        .single()

    if (error) {
        console.error('Failed to fetch user plan:', error.message)
        return null
    }

    return data?.plan || null
}

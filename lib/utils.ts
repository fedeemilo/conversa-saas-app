import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { subjectsColors, voices } from '@/constants'
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getSubjectColor = (subject: string) => {
    return subjectsColors[subject as keyof typeof subjectsColors]
}

export const getVoiceId = (
    voice: keyof typeof voices,
    style: keyof (typeof voices)['male'],
    locale: 'es' | 'en'
): string => {
    return voices[voice][style][locale] || 'sarah'
}

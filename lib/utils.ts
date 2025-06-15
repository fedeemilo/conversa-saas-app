import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { subjectsColors } from '@/constants'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getSubjectColor = (subject: string) => {
    return subjectsColors[subject as keyof typeof subjectsColors]
}

export const capitalize = (str: string | null) => {
    if (!str) return null

    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trimEnd() + '...'
}

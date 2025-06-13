'use client'

import { ChangeEvent } from 'react'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

export default function LanguageSwitcher() {
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newLocale = e.target.value
        router.replace(pathname, { locale: newLocale })
    }

    return (
        <select
            onChange={handleChange}
            value={locale}
            className="cursor-pointer rounded bg-white py-1 text-black"
        >
            <option value="en">EN</option>
            <option value="es">ES</option>
        </select>
    )
}

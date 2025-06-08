'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

const NavItems = () => {
    const pathname = usePathname()
    const t = useTranslations('navbar')

    const navItems = [
        { label: t('home'), href: '/' },
        { label: t('companions'), href: '/companions' },
        { label: t('journey'), href: '/my-journey' }
    ]

    return (
        <nav className="flex items-center gap-4">
            {navItems.map(({ label, href }) => (
                <Link
                    href={href}
                    key={href}
                    className={cn(pathname === href && 'text-primary font-semibold')}
                >
                    {label}
                </Link>
            ))}
        </nav>
    )
}

export default NavItems

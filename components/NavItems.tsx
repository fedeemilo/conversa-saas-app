'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface NavItemsProps {
    isMobile?: boolean
    onClickItem?: () => void
}

const NavItems = ({ isMobile = false, onClickItem }: NavItemsProps) => {
    const pathname = usePathname()
    const t = useTranslations('navbar')

    const navItems = [
        { label: t('home'), href: '/' },
        { label: t('companions'), href: '/companions' },
        { label: t('journey'), href: '/my-journey' }
    ]

    return (
        <nav className={cn(isMobile ? 'flex flex-col gap-4' : 'flex items-center gap-4')}>
            {navItems.map(({ label, href }) => (
                <Link
                    key={href}
                    href={href}
                    onClick={onClickItem}
                    className={cn(
                        isMobile ? 'font-medium text-gray-800' : '',
                        pathname === href && 'text-primary font-semibold'
                    )}
                >
                    {label}
                </Link>
            ))}
        </nav>
    )
}

export default NavItems

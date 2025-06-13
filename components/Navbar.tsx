'use client'

import Link from 'next/link'
import Image from 'next/image'
import NavItems from '@/components/NavItems'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
    const t = useTranslations('navbar')
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => setMenuOpen((prev) => !prev)
    const closeMenu = () => setMenuOpen(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) setMenuOpen(false)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <nav className="navbar relative">
            {/* Logo con más padding */}
            <Link href={'/'} prefetch={true}>
                <div className="flex cursor-pointer items-center gap-2.5 pl-2 sm:pl-0">
                    <Image
                        src={'/images/logo.svg'}
                        alt={'logo'}
                        width={76}
                        height={54}
                        style={{ transform: 'scale(1.8)' }}
                    />
                </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-8 sm:flex">
                <NavItems />
                <LanguageSwitcher />
                <SignedOut>
                    <SignInButton>
                        <button className="btn-signin">{t('signin')}</button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>

            {/* Mobile top right controls */}
            <div className="ml-auto flex items-center gap-3 pr-2 sm:hidden">
                <LanguageSwitcher />
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <button onClick={toggleMenu} aria-label="Toggle menu">
                    <div className="transition-transform duration-300 ease-in-out">
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </div>
                </button>
            </div>

            {/* Mobile menu */}
            <div
                className={`absolute top-[70px] left-0 z-50 w-full bg-white shadow-md transition-all duration-300 ease-in-out sm:hidden ${menuOpen ? 'visible scale-y-100 opacity-100' : 'invisible scale-y-95 opacity-0'} origin-top`}
            >
                <div className="flex flex-col gap-4 px-6 py-4">
                    <NavItems isMobile onClickItem={closeMenu} />
                    <SignedOut>
                        <SignInButton>
                            <button className="btn-signin w-full">{t('signin')}</button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

'use client'

import Link from 'next/link'
import Image from 'next/image'
import NavItems from '@/components/NavItems'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useState } from 'react'
import HamburgerButton from '@/components/HamburgerButton'
import es from '@/messages/es.json'
import SignInLoadingButton from './SignInLoadingButton'

const Navbar = () => {
    const t = es['navbar']
    const [menuOpen, setMenuOpen] = useState(false)
    const closeMenu = () => setMenuOpen(false)

    return (
        <nav className="navbar relative">
            {/* Logo */}
            <Link href={'/'} prefetch={true}>
                <div className="flex cursor-pointer items-center gap-2.5 pl-5 sm:pl-0">
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
            <div className="hidden items-center gap-6 sm:flex">
                <NavItems />
                <SignedOut>
                    <SignInLoadingButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>

            {/* Mobile nav right */}
            <div className="ml-auto flex items-center gap-3 overflow-hidden sm:hidden">
                <SignedIn>
                    <UserButton />
                </SignedIn>

                <HamburgerButton
                    isOpen={menuOpen}
                    setIsOpen={setMenuOpen}
                    className="mx-3 h-6 w-6"
                />
            </div>
            {/* Mobile menu */}
            <div
                className={`absolute top-[100px] left-0 z-50 w-full bg-white shadow-md transition-all duration-300 ease-in-out sm:hidden ${
                    menuOpen ? 'visible scale-y-100 opacity-100' : 'invisible scale-y-95 opacity-0'
                } origin-top`}
            >
                <div className="flex flex-col gap-4 px-6 py-4">
                    <NavItems isMobile onClickItem={closeMenu} />
                    <SignedOut>
                        <SignInLoadingButton />
                    </SignedOut>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

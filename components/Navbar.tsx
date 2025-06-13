'use client'

import Link from 'next/link'
import Image from 'next/image'
import NavItems from '@/components/NavItems'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import HamburgerAnimation from '@/components/HamburgerAnimation'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const Navbar = () => {
    const t = useTranslations('navbar')
    const [menuOpen, setMenuOpen] = useState(false)
    const [instance, setInstance] = useState<any>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)

    const toggleMenu = () => {
        if (menuOpen) {
            setClose()
            setMenuOpen(true)
        } else {
            setOpen()
            setMenuOpen(false)
        }
        setMenuOpen((prev) => !prev)
    }
    const closeMenu = () => setMenuOpen(false)

    const setOpen = () => {
        if (!instance) return
        instance.setSegment(0, 40)
        instance.play()
    }

    const setClose = () => {
        if (!instance) return
        instance.setFrame(40)
        instance.setSegment(40, 100)
        instance.play()
    }

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

            {/* Mobile nav right */}
            <div className="ml-auto flex items-center gap-3 overflow-hidden sm:hidden">
                <LanguageSwitcher />
                <SignedIn>
                    <UserButton />
                </SignedIn>

                <button
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    className="relative h-20 w-15 shrink-0 overflow-hidden"
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <DotLottieReact
                            src="https://lottie.host/808ed4b5-76f6-4881-ba52-4b5f7707f4bd/2QOQ111j3q.lottie"
                            autoplay={false}
                            loop={false}
                            dotLottieRefCallback={setInstance}
                        />
                    </div>
                </button>
            </div>
            {/* Mobile menu */}
            <div
                ref={menuRef}
                className={`absolute top-[100px] left-0 z-50 w-full bg-white shadow-md transition-all duration-300 ease-in-out sm:hidden ${
                    menuOpen ? 'visible scale-y-100 opacity-100' : 'invisible scale-y-95 opacity-0'
                } origin-top`}
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

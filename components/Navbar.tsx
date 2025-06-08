import Link from 'next/link'
import Image from 'next/image'
import NavItems from '@/components/NavItems'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'

const Navbar = () => {
    const t = useTranslations('navbar')

    return (
        <nav className="navbar">
            <Link href={'/'}>
                <div className="flex cursor-pointer items-center gap-2.5">
                    <Image src={'/images/logo.svg'} alt={'logo'} width={46} height={44} />
                </div>
            </Link>
            <div className="flex items-center gap-8">
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
        </nav>
    )
}
export default Navbar

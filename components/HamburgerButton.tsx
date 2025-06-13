'use client'

import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import animationData from '@/constants/hamburger.json'

interface Props {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    className?: string
}

const HamburgerButton = ({ isOpen, setIsOpen, className }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const anim = useRef<any>(null)

    useEffect(() => {
        if (!containerRef.current) return

        anim.current = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData
        })

        return () => anim.current?.destroy()
    }, [])

    const handleClick = () => {
        if (!anim.current) return

        anim.current.setDirection(isOpen ? -1 : 1)
        anim.current.play()
        setIsOpen(!isOpen)
    }

    return (
        <div
            className={className || 'h-10 w-10 cursor-pointer'}
            onClick={handleClick}
            ref={containerRef}
        />
    )
}

export default HamburgerButton

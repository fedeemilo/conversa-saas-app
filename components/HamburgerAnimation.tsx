'use client'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useEffect, useState } from 'react'

interface Props {
    isOpen: boolean
    className?: string
}

const HamburgerAnimation = ({ isOpen }: Props) => {
    const [instance, setInstance] = useState<any>(null)

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
        <DotLottieReact
            src="https://lottie.host/808ed4b5-76f6-4881-ba52-4b5f7707f4bd/2QOQ111j3q.lottie"
            autoplay={false}
            loop={false}
            dotLottieRefCallback={setInstance}
            style={{ width: '100px', height: '100px' }}
        />
    )
}

export default HamburgerAnimation

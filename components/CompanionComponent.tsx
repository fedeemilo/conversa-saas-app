'use client'

import { cn, getSubjectColor } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'
import { vapi } from '@/lib/vapi.sdk'
import Image from 'next/image'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import soundwaves from '@/constants/soundwaves.json'
import { configureAssistant } from '@/lib/assistant.server'
import { useLocale } from 'next-intl'

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED'
}

const CompanionComponent = ({
    companionId,
    subject,
    name,
    userName,
    userImage,
    style,
    voice,
    topic,
    translations: { connecting, turnOnMic, turnOffMic, startSession, endSession }
}: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [messages, setMessages] = useState<SavedMessage[]>([])

    const lottieRef = useRef<LottieRefCurrentProps>(null)

    const locale = useLocale()

    useEffect(() => {
        if (lottieRef) {
            if (isSpeaking) {
                lottieRef.current?.play()
            } else {
                lottieRef.current?.stop()
            }
        }
    }, [isSpeaking, lottieRef])

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE)

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED)

            // addToSessionHistory(companionId)
        }

        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = { role: message.role, content: message.transcript }
                setMessages((prev) => [newMessage, ...prev])
            }
        }
        const onSpeechStart = () => setIsSpeaking(true)
        const onSpeechEnd = () => setIsSpeaking(false)
        const onError = (error: Error) => console.error('Call error:', error)

        vapi.on('call-start', onCallStart)
        vapi.on('call-end', onCallEnd)
        vapi.on('message', onMessage)
        vapi.on('error', onError)
        vapi.on('speech-start', onSpeechStart)
        vapi.on('speech-end', onSpeechEnd)

        return () => {
            vapi.off('call-start', onCallStart)
            vapi.off('call-end', onCallEnd)
            vapi.off('message', onMessage)
            vapi.off('error', onError)
            vapi.off('speech-start', onSpeechStart)
            vapi.off('speech-end', onSpeechEnd)
        }
    }, [])

    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted()
        vapi.setMuted(!isMuted)

        setIsMuted(!isMuted)
    }

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING)

        const assistantOverrides = {
            variableValues: {
                subject,
                topic,
                style
            },
            clientMessages: ['transcript'],
            serverMessages: []
        }

        const assistant = await configureAssistant(
            voice,
            style,
            locale as 'es' | 'en',
            subject,
            topic
        )

        // @ts-expect-error properties are ok
        await vapi.start(assistant, assistantOverrides)
    }

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED)
        vapi.stop()
    }

    return (
        <section className="flex h-[70vh] flex-col">
            <section className="flex gap-8 max-sm:flex-col">
                <div className="companion-section">
                    <div
                        className="companion-avatar"
                        style={{ backgroundColor: getSubjectColor(subject) }}
                    >
                        <div
                            className={cn(
                                'absolute transition-opacity duration-1000',
                                callStatus === CallStatus.FINISHED ||
                                    callStatus === CallStatus.INACTIVE
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                callStatus === CallStatus.CONNECTING && 'animate-pulse opacity-100'
                            )}
                        >
                            <Image
                                src={`/icons/${subject}.svg`}
                                alt={subject}
                                width={150}
                                height={150}
                                className="max-sm:w-fit"
                            />
                        </div>

                        <div
                            className={cn(
                                'absolute transition-opacity duration-1000',
                                callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0'
                            )}
                        >
                            <Lottie
                                lottieRef={lottieRef}
                                animationData={soundwaves}
                                autoplay={false}
                                className="companion-lottie"
                            />
                        </div>
                    </div>
                    <p className="text-2xl font-bold">{name}</p>
                </div>
                <div className="user-section">
                    <div className="user-avatar">
                        <Image
                            src={userImage}
                            alt={userName}
                            width={130}
                            height={130}
                            className="rounded-lg"
                        />
                        <p className="text-2xl font-bold">{userName}</p>
                    </div>
                    <button
                        className="btn-mic"
                        onClick={toggleMicrophone}
                        disabled={callStatus !== CallStatus.ACTIVE}
                    >
                        <Image
                            src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'}
                            alt="mic"
                            width={36}
                            height={36}
                            style={
                                callStatus === CallStatus.ACTIVE
                                    ? { opacity: 1 }
                                    : { opacity: 0.5, cursor: 'default' }
                            }
                        />
                        <p className="max-sm:hidden">{isMuted ? turnOnMic : turnOffMic}</p>
                    </button>
                    <button
                        className={cn(
                            'w-full cursor-pointer rounded-lg py-2 text-white transition-colors',
                            callStatus === CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary',
                            callStatus === CallStatus.CONNECTING && 'animate-pulse'
                        )}
                        onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                    >
                        {callStatus === CallStatus.ACTIVE
                            ? endSession
                            : callStatus === CallStatus.CONNECTING
                              ? connecting
                              : startSession}
                    </button>
                </div>
            </section>

            <section className="transcript">
                <div className="transcript-message no-scrollbar">
                    {messages.map((message, index) => {
                        if (message.role === 'assistant') {
                            return (
                                <p key={index} className="max-sm:text-sm">
                                    {name.split(' ')[0].replace('/[.,]/g, ', '')}: {message.content}
                                </p>
                            )
                        } else {
                            return (
                                <p key={index} className="text-primary max-sm:text-sm">
                                    {userName}: {message.content}
                                </p>
                            )
                        }
                    })}
                </div>

                <div className="transcript-fade" />
            </section>
        </section>
    )
}
export default CompanionComponent

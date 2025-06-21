'use client'

import { useState, useEffect, useRef } from 'react'
import { vapi } from '@/lib/vapi.sdk'
import { configureAssistant } from '@/lib/assistant.server'
import { addToSessionHistory } from '@/lib/actions/companion.actions'
import * as Sentry from '@sentry/nextjs'
import { LottieRefCurrentProps } from 'lottie-react'
import { saveConversation } from '@/lib/actions/conversations.actions'
import { PlanName } from '@/lib/actions/user.actions'
import axios from 'axios'

export enum CallStatus {
	INACTIVE = 'INACTIVE',
	CONNECTING = 'CONNECTING',
	ACTIVE = 'ACTIVE',
	FINISHED = 'FINISHED'
}

interface UseCompanionProps {
	companionId: string
	subject: string
	topic: string
	style: 'casual' | 'formal'
	voice: 'male' | 'female'
	userName: string
	name: string
}

export function useCompanion({
	companionId,
	subject,
	topic,
	style,
	voice,
	userName,
	name
}: UseCompanionProps) {
	const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
	const [isSpeaking, setIsSpeaking] = useState(false)
	const [isMuted, setIsMuted] = useState(false)
	const [messages, setMessages] = useState<SavedMessage[]>([])

	const [summary, setSummary] = useState<string | null>(null)
	const [loadingSummary, setLoadingSummary] = useState(false)
	const [userPlan, setUserPlan] = useState<PlanName>(null)
	const [conversationId, setConversationId] = useState<string | null>(null)
	const [copied, setCopied] = useState(false)

	const lottieRef = useRef<LottieRefCurrentProps>(null)
	const messagesRef = useRef<SavedMessage[]>([])

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

		const onCallEnd = async () => {
			setCallStatus(CallStatus.FINISHED)
			try {
				await addToSessionHistory(companionId)

				setTimeout(async () => {
					const transcript = messagesRef.current
						.slice()
						.reverse()
						.map((m) => `${m.role === 'assistant' ? 'Tutor' : 'Usuario'}: ${m.content}`)
						.join('\n')

					await saveConversation(companionId, transcript)
				}, 1500)
			} catch (err) {
				console.error('Error guardando conversación', err)
				Sentry.captureException(err)
			}
		}

		const onMessage = (message: Message) => {
			if (message.type === 'transcript' && message.transcriptType === 'final') {
				const newMessage = { role: message.role, content: message.transcript }
				setMessages((prev) => [newMessage, ...prev])
				messagesRef.current = [newMessage, ...messagesRef.current]
			}
		}

		const onSpeechStart = () => setIsSpeaking(true)
		const onSpeechEnd = () => setIsSpeaking(false)
		const onError = (error: Error) => {
			console.error('Call error:', error)
			Sentry.captureException(error)
		}

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

	useEffect(() => {
		const checkPlan = async () => {
			if (callStatus !== CallStatus.FINISHED) return

			try {
				const [{ data: planData }, convRes] = await Promise.all([
					axios.get('/api/user/plan'),
					axios.get('/api/conversations/latest').catch((err) => {
						if (err.response?.status === 404) return { data: null }
						throw err
					})
				])

				setUserPlan(planData.plan)
				if (convRes.data) setConversationId(convRes.data.id)
			} catch (err) {
				console.error('Error al obtener plan o conversación más reciente', err)
			}
		}

		checkPlan()
	}, [callStatus])

	const toggleMicrophone = () => {
		const current = vapi.isMuted()
		vapi.setMuted(!current)
		setIsMuted(!current)
	}

	const handleCall = async () => {
		setCallStatus(CallStatus.CONNECTING)

		const assistantOverrides = {
			variableValues: { subject, topic, style },
			clientMessages: ['transcript'],
			serverMessages: []
		}

		const assistant = await configureAssistant(voice, style, 'es', subject, topic)
		// @ts-expect-error properties are ok
		await vapi.start(assistant, assistantOverrides)
	}

	const handleDisconnect = () => {
		setCallStatus(CallStatus.FINISHED)
		vapi.stop()
	}

	const handleGenerate = async () => {
		const transcript = messages
			.slice()
			.reverse()
			.map((m) => `${m.role === 'assistant' ? name : userName}: ${m.content}`)
			.join('\n')

		if (!transcript.trim()) return

		try {
			setLoadingSummary(true)
			const res = await fetch('/api/conversations/summary', {
				method: 'POST',
				body: JSON.stringify({ transcript }),
				headers: { 'Content-Type': 'application/json' }
			})

			if (!res.ok) throw new Error('Error al generar el resumen')

			const data = await res.json()
			setSummary(data.summary)
		} catch (err) {
			console.error(err)
		} finally {
			setLoadingSummary(false)
		}
	}

	return {
		callStatus,
		isMuted,
		messages,
		toggleMicrophone,
		handleCall,
		handleDisconnect,
		lottieRef,
		summary,
		loadingSummary,
		userPlan,
		conversationId,
		setSummary,
		setLoadingSummary,
		handleGenerate,
		copied,
		setCopied
	}
}

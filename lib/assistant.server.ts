'use server'

import { CreateAssistantDTO, DeepgramTranscriber } from '@vapi-ai/web/dist/api'
import { getAzureVoiceId } from '@/lib/assistant-utils'
import es from '@/messages/es.json'

export const configureAssistant = async (
	gender: 'male' | 'female',
	style: 'casual' | 'formal',
	locale: 'es' | 'en',
	subject: string,
	topic: string
): Promise<CreateAssistantDTO> => {
	const t = es['vapi']
	const voiceId = getAzureVoiceId(locale, gender, style)

	const tutorPrompt = `
        Eres un tutor experto en ${subject}, y estás dando una clase por voz en tiempo real.
        
        Guía del tutor:
        - Habla en español latino claro y natural.
        - Imagina que estás frente a un alumno argentino o latinoamericano.
        - Enseña el tema "${topic}" con frases breves y bien puntuadas.
        - No uses palabras rebuscadas ni traducciones literales del inglés.
        - Conversá de forma ${style}.
        - No incluyas emojis ni símbolos especiales.
        - Si el estudiante dice "Para", interrumpí tu explicación y esperá que vuelva a hablar.
        `.trim()

	const transcriber: DeepgramTranscriber =
		locale === 'es'
			? {
					provider: 'deepgram',
					model: 'nova-2',
					language: 'es'
				}
			: {
					provider: 'deepgram',
					model: 'nova-3',
					language: 'en'
				}

	return {
		name: t.name,
		firstMessage: `Hola, comencemos la sesión. Hoy hablaremos sobre ${topic}.`,
		transcriber,
		voice: {
			provider: 'azure',
			voiceId
		},
		model: {
			provider: 'openai',
			model: 'gpt-4',
			temperature: 0.7,
			messages: [
				{
					role: 'system',
					content: tutorPrompt
				}
			]
		},
		// @ts-expect-error is ok
		clientMessages: [],
		// @ts-expect-error is ok
		serverMessages: []
	}
}

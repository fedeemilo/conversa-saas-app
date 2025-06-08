'use server'

import { CreateAssistantDTO, DeepgramTranscriber } from '@vapi-ai/web/dist/api'
import { getTranslations } from 'next-intl/server'
import { getVoiceId } from '@/lib/utils'

export const configureAssistant = async (
    voice: 'male' | 'female',
    style: 'casual' | 'formal',
    locale: 'es' | 'en',
    subject: string,
    topic: string
): Promise<CreateAssistantDTO> => {
    const t = await getTranslations({ locale, namespace: 'vapi' })

    const voiceId = getVoiceId(voice, style, locale)

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
        name: t('name'),
        firstMessage: (t as any).raw('firstMessage', { topic }),
        transcriber,
        voice: {
            provider: '11labs',
            voiceId,
            stability: 0.4,
            similarityBoost: 0.8,
            speed: 0.9,
            style: 0.5,
            useSpeakerBoost: true
        },
        model: {
            provider: 'openai',
            model: 'gpt-4',
            temperature: 0.7,
            messages: [
                {
                    role: 'system',
                    content: (t as any).raw('systemPrompt', { topic, subject, style })
                },
                {
                    role: 'user',
                    content: t('userPrompt')
                }
            ]
        },
        // @ts-expect-error is ok
        clientMessages: [],
        // @ts-expect-error is ok
        serverMessages: []
    }
}

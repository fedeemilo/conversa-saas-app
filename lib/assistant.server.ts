'use server'

import { CreateAssistantDTO, DeepgramTranscriber } from '@vapi-ai/web/dist/api'
import { getTranslations } from 'next-intl/server'
import { getVoiceId } from '@/lib/utils'
import { splitTextForTTS, getAzureVoiceId } from '@/lib/assistant-utils'

export const configureAssistant = async (
    gender: 'male' | 'female',
    style: 'casual' | 'formal',
    locale: 'es' | 'en',
    subject: string,
    topic: string
): Promise<CreateAssistantDTO> => {
    const t = await getTranslations({ locale, namespace: 'vapi' })

    const voiceId = getAzureVoiceId(locale, gender, style)
    const systemPromptRaw = (t as any).raw('systemPrompt', { topic, subject, style })
    const userPromptRaw = t('userPrompt')

    const processedSystemPrompt = splitTextForTTS(systemPromptRaw).join(' ')
    const processedUserPrompt = splitTextForTTS(userPromptRaw).join(' ')

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
                    content: processedSystemPrompt
                },
                {
                    role: 'user',
                    content: processedUserPrompt
                }
            ]
        },
        // @ts-expect-error is ok
        clientMessages: [],
        // @ts-expect-error is ok
        serverMessages: []
    }
}

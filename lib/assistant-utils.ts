export function splitTextForTTS(text: string, maxLength: number = 250): string[] {
    const sentences = text.split(/(?<=[.!?])\s+/)
    const chunks: string[] = []
    let currentChunk = ''

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length <= maxLength) {
            currentChunk += sentence + ' '
        } else {
            chunks.push(currentChunk.trim())
            currentChunk = sentence + ' '
        }
    }

    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim())
    }

    return chunks
}

export const getAzureVoiceId = (
    locale: 'es' | 'en',
    gender: 'male' | 'female',
    style: 'casual' | 'formal'
): string => {
    const voices = {
        es: {
            male: {
                casual: 'es-MX-JorgeNeural',
                formal: 'es-ES-AlvaroNeural'
            },
            female: {
                casual: 'es-MX-DaliaNeural',
                formal: 'es-ES-ElviraNeural'
            }
        },
        en: {
            male: {
                casual: 'en-US-GuyNeural',
                formal: 'en-US-BrandonNeural'
            },
            female: {
                casual: 'en-US-JennyNeural',
                formal: 'en-US-AriaNeural'
            }
        }
    }

    return voices[locale][gender][style]
}

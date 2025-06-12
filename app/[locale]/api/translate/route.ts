import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: Request) {
    try {
        const { texts, targetLang } = await req.json()

        if (!Array.isArray(texts) || !texts.length || !targetLang) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        const params = new URLSearchParams()
        params.append('auth_key', process.env.DEEPL_APIKEY!)
        params.append('target_lang', targetLang)

        texts.forEach((text) => {
            params.append('text', text)
        })

        const response = await axios.post('https://api-free.deepl.com/v2/translate', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })

        const translations = response.data.translations.map((t: any) => t.text)
        return NextResponse.json({ translations })
    } catch (err) {
        console.error('Error in /api/translate:', err)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

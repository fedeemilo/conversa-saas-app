import createMiddleware from 'next-intl/middleware'
import { clerkMiddleware } from '@clerk/nextjs/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const combinedMiddleware = clerkMiddleware(async (auth, request) => {
    return intlMiddleware(request)
})

export default combinedMiddleware

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)'
    ]
}

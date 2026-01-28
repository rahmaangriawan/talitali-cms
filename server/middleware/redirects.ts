import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    // Only run on the request processing, checking if a redirect exists
    const path = event.path
    if (path.startsWith('/api') || path.startsWith('/_nuxt')) return

    // Check for direct match
    const redirect = await prisma.redirect.findUnique({
        where: { source: path }
    })

    if (redirect && redirect.isActive) {
        return sendRedirect(event, redirect.destination, redirect.code)
    }
})

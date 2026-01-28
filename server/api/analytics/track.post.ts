import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const headers = getHeaders(event)

    // Get IP address (Nitro helper)
    const ip = event.node.req.socket.remoteAddress || 'unknown'
    const userAgent = headers['user-agent']
    const referer = body.referrer || headers['referer']

    try {
        // @ts-expect-error - Prisma type sync lag
        await prisma.visit.create({
            data: {
                ip: String(ip),
                path: body.path || '/',
                userAgent: userAgent,
                referer: referer
            }
        })
        return { success: true }
    } catch (e) {
        return { success: false }
    }
})

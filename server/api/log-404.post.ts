import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { path, userAgent } = body
    const ip = getRequestIP(event)

    console.log('Backend: Logging 404 for:', path, 'from IP:', ip)

    // Check if entry exists to increment count
    const existing = await prisma.log404.findFirst({
        where: { path }
    })

    if (existing) {
        await prisma.log404.update({
            where: { id: existing.id },
            data: {
                count: { increment: 1 },
                lastSeen: new Date(),
                userAgent, // Update latest UA
                ip
            }
        })
    } else {
        await prisma.log404.create({
            data: {
                path,
                userAgent,
                ip
            }
        })
    }

    return { success: true }
})

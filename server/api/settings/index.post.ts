import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    const body = await readBody(event)

    // Update or Create settings
    const promises = Object.entries(body).map(([key, value]) => {
        return prisma.setting.upsert({
            where: { key: key },
            update: { value: String(value) },
            create: { key: key, value: String(value) }
        })
    })

    await Promise.all(promises)

    return { success: true }
})

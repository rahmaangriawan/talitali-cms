import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user?.role)) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    if (event.method === 'GET') {
        return await prisma.log404.findMany({
            orderBy: { lastSeen: 'desc' },
            take: 100
        })
    }
})

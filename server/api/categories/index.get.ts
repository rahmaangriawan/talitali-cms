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

    return await prisma.category.findMany({
        include: {
            _count: {
                select: { posts: true }
            }
        },
        orderBy: {
            name: 'asc'
        }
    })
})

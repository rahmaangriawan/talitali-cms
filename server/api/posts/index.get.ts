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

    const posts = await prisma.post.findMany({
        include: {
            author: {
                select: { name: true, email: true }
            },
            category: true,
            tags: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return posts
})

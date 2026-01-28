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

    const id = event.context.params?.id
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Post ID is required'
        })
    }

    await prisma.post.delete({
        where: { id: parseInt(id) }
    })

    return { success: true }
})

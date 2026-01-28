import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user?.role)) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const id = parseInt(event.context.params.id)
    if (isNaN(id)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
    }

    if (event.method === 'DELETE') {
        return await prisma.redirect.delete({
            where: { id }
        })
    }
})

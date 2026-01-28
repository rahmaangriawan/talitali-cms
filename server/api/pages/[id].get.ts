import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const id = event.context.params?.id
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'ID is required' })
    }

    return await prisma.page.findUnique({
        where: { id: parseInt(id) },
        include: {
            customValues: {
                include: {
                    field: true
                }
            }
        }
    })
})

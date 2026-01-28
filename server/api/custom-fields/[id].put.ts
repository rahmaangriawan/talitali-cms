import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const id = event.context.params?.id
    const body = await readBody(event)

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'ID is required' })
    }

    return await prisma.customField.update({
        where: { id: parseInt(id) },
        data: {
            name: body.name,
            slug: body.slug,
            type: body.type,
            target: body.target,
            options: body.options ? JSON.stringify(body.options) : null
        }
    })
})

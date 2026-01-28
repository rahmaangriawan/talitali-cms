import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const body = await readBody(event)

    if (!body.name || !body.slug) {
        throw createError({ statusCode: 400, statusMessage: 'Name and slug are required' })
    }

    return await prisma.customField.create({
        data: {
            name: body.name,
            slug: body.slug,
            type: body.type || 'TEXT',
            target: body.target || 'POST',
            options: body.options ? JSON.stringify(body.options) : null
        }
    })
})

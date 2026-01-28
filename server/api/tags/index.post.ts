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
    if (!body.name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Name is required'
        })
    }

    const slug = body.slug || body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

    return await prisma.tag.create({
        data: {
            name: body.name,
            slug: slug
        }
    })
})

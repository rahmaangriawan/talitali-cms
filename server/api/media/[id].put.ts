import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const id = parseInt(event.context.params.id)
    if (isNaN(id)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
    }

    const body = await readBody(event)

    // We only allow updating metadata, not the file itself via this endpoint
    // Allowed fields: filename, altText
    const updateData: any = {}
    if (body.filename) updateData.filename = body.filename
    if (body.altText !== undefined) updateData.altText = body.altText

    const media = await prisma.media.update({
        where: { id },
        data: updateData
    })

    return media
})

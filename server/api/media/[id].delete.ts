import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'
import fs from 'node:fs/promises'
import path from 'node:path'

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
            statusMessage: 'ID is required'
        })
    }

    const media = await prisma.media.findUnique({
        where: { id: parseInt(id) }
    })

    if (media) {
        // Delete physical file
        const filePath = path.join(process.cwd(), 'public', media.url)
        try {
            await fs.unlink(filePath)
        } catch (e) {
            console.error('Failed to delete file:', filePath)
        }

        // Delete database record
        await prisma.media.delete({
            where: { id: parseInt(id) }
        })
    }

    return { success: true }
})

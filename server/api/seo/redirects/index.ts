import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user?.role)) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    if (event.method === 'GET') {
        return await prisma.redirect.findMany({
            orderBy: { createdAt: 'desc' }
        })
    }

    if (event.method === 'POST') {
        const body = await readBody(event)
        // Ensure source starts with /
        const source = body.source.startsWith('/') ? body.source : `/${body.source}`

        return await prisma.redirect.create({
            data: {
                source,
                destination: body.destination,
                code: parseInt(body.code)
            }
        })
    }
})

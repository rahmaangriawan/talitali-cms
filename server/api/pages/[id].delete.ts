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

    const page = await prisma.page.delete({
        where: { id: parseInt(id) }
    })

    // Invalidate Cache
    const cache = useCache()
    await cache.invalidate(`public_page_${page.slug}`)

    return { success: true }
})

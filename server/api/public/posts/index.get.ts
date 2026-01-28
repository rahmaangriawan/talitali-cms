import { prisma } from '~/server/utils/prisma'
import { useCache } from '~/server/utils/cache'

export default defineEventHandler(async (event) => {
    const cache = useCache()
    const cacheKey = 'public_posts_index'

    const cachedData = await cache.get(cacheKey)
    if (cachedData) return cachedData

    const posts = await prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        include: {
            author: { select: { name: true } },
            category: true,
            tags: true
        },
        orderBy: { createdAt: 'desc' }
    })

    await cache.set(cacheKey, posts)
    return posts
})

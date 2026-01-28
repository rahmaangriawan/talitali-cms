import { prisma } from '../../../utils/prisma'
import { useCache } from '../../../utils/cache'

export default defineEventHandler(async (event) => {
    const slug = event.context.params?.slug
    if (!slug) {
        throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
    }

    const cache = useCache()
    const cacheKey = `post_${slug}`

    const query = getQuery(event)
    const isPreview = query.preview === 'true'

    // Skip cache if preview
    if (!isPreview) {
        const cachedData = await cache.get(cacheKey)
        if (cachedData) return cachedData
    }

    const post = await prisma.post.findUnique({
        where: { slug: slug },
        include: {
            author: {
                select: { name: true }
            },
            category: true,
            tags: true,
            customValues: {
                include: {
                    field: true
                }
            }
        }
    })

    if (!post || (!isPreview && post.status !== 'PUBLISHED')) {
        throw createError({ statusCode: 404, statusMessage: 'Post not found' })
    }

    if (!isPreview) {
        await cache.set(cacheKey, post)
    }

    // Fallback logic for metaTitle
    if (!post.metaTitle) {
        post.metaTitle = post.title
    }

    return post
})

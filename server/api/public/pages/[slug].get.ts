import { prisma } from '../../../utils/prisma'
import { useCache } from '../../../utils/cache'

export default defineEventHandler(async (event) => {
    const slug = event.context.params?.slug
    if (!slug) {
        throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
    }

    const cache = useCache()
    const cacheKey = `public_page_${slug}`

    const query = getQuery(event)
    const isPreview = query.preview === 'true'

    // Skip cache if preview
    if (!isPreview) {
        const cachedData = await cache.get(cacheKey)
        if (cachedData) return cachedData
    }

    const page = await prisma.page.findUnique({
        where: { slug: slug },
        include: {
            customValues: {
                include: {
                    field: true
                }
            }
        }
    })

    if (!page || (!isPreview && page.status !== 'PUBLISHED')) {
        throw createError({ statusCode: 404, statusMessage: 'Page not found' })
    }

    if (!isPreview) {
        await cache.set(cacheKey, page)
    }

    // Fallback logic for metaTitle
    if (!page.metaTitle) {
        page.metaTitle = page.title
    }

    return page
})

import { prisma } from '../../utils/prisma'
import { getServerSession } from '#auth'
import { useCache } from '../../utils/cache'
import { sanitizeContent } from '../../utils/security'

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
            statusMessage: 'Post ID is required'
        })
    }

    const body = await readBody(event)
    const sanitizedContent = sanitizeContent(body.content)

    const post = await prisma.post.update({
        where: { id: parseInt(id) },
        data: {
            title: body.title,
            slug: body.slug,
            content: sanitizedContent,
            excerpt: body.excerpt,
            featuredImage: body.featuredImage,
            status: body.status,
            categoryId: body.categoryId ? parseInt(body.categoryId) : null,
            tags: {
                set: body.tagIds ? body.tagIds.map((id: number) => ({ id })) : []
            },
            metaTitle: body.metaTitle,
            metaDescription: body.metaDescription,
            noIndex: body.noIndex || false,
            publishedAt: body.publishedAt ? new Date(body.publishedAt) : (body.status === 'PUBLISHED' && !body.publishedAt ? new Date() : body.publishedAt),
        }
    })

    // Update Custom Values
    if (body.customFields) {
        await prisma.customFieldValue.deleteMany({
            where: { postId: parseInt(id) }
        })

        const fieldDefinitions = await prisma.customField.findMany({
            where: { target: 'POST' }
        })

        const customValueData = []
        for (const field of fieldDefinitions) {
            if (body.customFields[field.slug] !== undefined) {
                customValueData.push({
                    fieldId: field.id,
                    postId: parseInt(id),
                    value: String(body.customFields[field.slug])
                })
            }
        }

        if (customValueData.length > 0) {
            await prisma.customFieldValue.createMany({
                data: customValueData
            })
        }
    }

    // Invalidate public cache
    const cache = useCache()
    await cache.invalidate('public_posts_index')
    await cache.invalidate(`post_${body.slug}`)

    return post
})

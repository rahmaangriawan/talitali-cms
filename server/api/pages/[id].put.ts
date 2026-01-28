import { prisma } from '../../utils/prisma'
import { getServerSession } from '#auth'
import { sanitizeContent } from '../../utils/security'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const id = event.context.params?.id
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'ID is required' })
    }

    const body = await readBody(event)
    const sanitizedContent = sanitizeContent(body.content)

    const page = await prisma.page.update({
        where: { id: parseInt(id) },
        data: {
            title: body.title,
            slug: body.slug,
            content: sanitizedContent,
            featuredImage: body.featuredImage,
            status: body.status,
            metaTitle: body.metaTitle,
            metaDescription: body.metaDescription,
            noIndex: body.noIndex || false,
            publishedAt: body.publishedAt ? new Date(body.publishedAt) : (body.status === 'PUBLISHED' && !body.publishedAt ? new Date() : body.publishedAt),
        }
    })

    // Update Custom Fields
    if (body.customFields) {
        await prisma.customFieldValue.deleteMany({
            where: { pageId: parseInt(id) }
        })

        const fieldDefinitions = await prisma.customField.findMany({
            where: { target: 'PAGE' }
        })

        const customValueData = []
        for (const field of fieldDefinitions) {
            if (body.customFields[field.slug] !== undefined) {
                customValueData.push({
                    fieldId: field.id,
                    pageId: parseInt(id),
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

    // Invalidate Cache
    const cache = useCache()
    await cache.invalidate(`public_page_${page.slug}`)

    return page
})

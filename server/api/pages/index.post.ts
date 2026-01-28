import { prisma } from '../../utils/prisma'
import { getServerSession } from '#auth'
import { sanitizeContent } from '../../utils/security'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const body = await readBody(event)

    if (!body.title || !body.content) {
        throw createError({ statusCode: 400, statusMessage: 'Title and content are required' })
    }

    const slug = body.slug || body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    const sanitizedContent = sanitizeContent(body.content)

    // Fetch field definitions for Target PAGE
    const fieldDefinitions = await prisma.customField.findMany({
        where: { target: 'PAGE' }
    })

    const customValueData = []
    if (body.customFields) {
        for (const field of fieldDefinitions) {
            if (body.customFields[field.slug] !== undefined) {
                customValueData.push({
                    fieldId: field.id,
                    value: String(body.customFields[field.slug])
                })
            }
        }
    }

    return await prisma.page.create({
        data: {
            title: body.title,
            slug: slug,
            content: sanitizedContent,
            featuredImage: body.featuredImage,
            status: body.status || 'DRAFT',
            metaTitle: body.metaTitle,
            metaDescription: body.metaDescription,
            noIndex: body.noIndex || false,
            publishedAt: body.publishedAt ? new Date(body.publishedAt) : (body.status === 'PUBLISHED' ? new Date() : null),
            customValues: {
                create: customValueData
            }
        }
    })
})

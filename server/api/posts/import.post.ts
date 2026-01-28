import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const body = await readBody(event)

    // Support both the "FINAL" format (nested in .data) and the old simple array format
    let articles = []
    if (body.type === 'article' && Array.isArray(body.data)) {
        articles = body.data
    } else if (Array.isArray(body)) {
        articles = body
    } else {
        articles = [body]
    }

    const results = {
        success: 0,
        failed: 0,
        errors: [] as string[]
    }

    // Find the current user to set as author
    const user = await prisma.user.findUnique({
        where: { email: session.user?.email || '' }
    })

    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    for (const article of articles) {
        try {
            // Mapping logic for both formats
            const title = article.title
            const slug = article.slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            const content = article.content?.html || article.content_html || article.summary || title
            const excerpt = article.excerpt || article.summary || ''
            const featuredImage = article.images?.[0]?.url || article.imageUrl || ''
            const metaTitle = article.seo?.title || title
            const metaDescription = article.seo?.description || excerpt
            const publishedAt = article.meta?.published_at ? new Date(article.meta.published_at) : new Date()

            // Find or create category (if provided)
            let categoryId: number | undefined
            const catName = article.category || 'Uncategorized'
            const cat = await prisma.category.upsert({
                where: { name: catName },
                update: {},
                create: {
                    name: catName,
                    slug: catName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                }
            })
            categoryId = cat.id

            // Create post
            await prisma.post.create({
                data: {
                    title,
                    slug,
                    content,
                    excerpt,
                    featuredImage,
                    status: 'DRAFT',
                    authorId: user.id,
                    categoryId: categoryId,
                    metaTitle,
                    metaDescription,
                    publishedAt
                }
            })
            results.success++
        } catch (err: any) {
            results.failed++
            results.errors.push(`Failed to import "${article.title || 'Unknown'}": ${err.message}`)
        }
    }

    return results
})

import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const posts = await prisma.post.findMany({
        where: { status: 'PUBLISHED', noIndex: false },
        select: { slug: true, updatedAt: true }
    })

    const pages = await prisma.page.findMany({
        where: { status: 'PUBLISHED', noIndex: false },
        select: { slug: true, updatedAt: true }
    })

    const baseURL = 'https://talitali.co.id'

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseURL}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`

    posts.forEach(post => {
        // Remove 'ports/' prefix if it exists in the slug for sitemap generation
        const postSlug = post.slug.startsWith('ports/') ? post.slug.substring(6) : post.slug;
        sitemap += `
    <url>
        <loc>${baseURL}/${postSlug}</loc>
        <lastmod>${post.updatedAt.toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`
    })

    pages.forEach(page => {
        sitemap += `
    <url>
        <loc>${baseURL}/${page.slug}</loc>
        <lastmod>${page.updatedAt.toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>`
    })

    sitemap += `
</urlset>`

    setResponseHeader(event, 'Content-Type', 'application/xml')
    return sitemap
})

import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const settings = await prisma.setting.findMany({
        where: { key: { in: ['site_title', 'site_tagline'] } }
    })

    const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const robots = [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${siteUrl}/sitemap.xml`
    ].join('\n')

    setHeader(event, 'Content-Type', 'text/plain')
    return robots
})

import { prisma } from '../../utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))

    // 1. Total Visits (all time)
    // @ts-expect-error - Prisma type sync lag
    const totalVisits = await prisma.visit.count()

    // @ts-expect-error - Prisma type sync lag
    const uniqueIPs = await prisma.visit.groupBy({
        by: ['ip'],
        _count: {
            ip: true
        }
    })
    const totalUniques = uniqueIPs.length

    // 3. Top Pages
    // @ts-expect-error - Prisma type sync lag
    const topPages = await prisma.visit.groupBy({
        by: ['path'],
        _count: {
            path: true
        },
        orderBy: {
            _count: {
                path: 'desc'
            }
        },
        take: 10
    })

    // 4. Last 30 Days Trend (Group by day)
    // @ts-expect-error - Prisma type sync lag
    const visitsLast30Days = await prisma.visit.findMany({
        where: {
            createdAt: {
                gte: thirtyDaysAgo
            }
        },
        select: {
            createdAt: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    // Process trend data
    const trend: Record<string, number> = {}
    visitsLast30Days.forEach(v => {
        const date = v.createdAt.toISOString().split('T')[0]
        trend[date] = (trend[date] || 0) + 1
    })

    const trendData = Object.entries(trend).map(([date, count]) => ({ date, count }))

    return {
        totalVisits,
        totalUniques,
        topPages,
        trendData,
        // @ts-expect-error - Prisma type sync lag
        recentVisits: await prisma.visit.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' }
        })
    }
})

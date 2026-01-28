import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    // Public endpoint for site settings

    const settings = await prisma.setting.findMany()
    // Reduce to a simple object
    return settings.reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value
        return acc
    }, {})
})

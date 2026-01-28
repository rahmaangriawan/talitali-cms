import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user?.email }
    })

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    const id = parseInt(event.context.params?.id as string)

    // Prevent deleting self
    if (id === currentUser.id) {
        throw createError({ statusCode: 400, statusMessage: 'Cannot delete yourself' })
    }

    await prisma.user.delete({
        where: { id }
    })

    return { success: true }
})

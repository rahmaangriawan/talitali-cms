import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'
import bcrypt from 'bcrypt'

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
    const body = await readBody(event)

    const updateData: any = {
        name: body.name,
        email: body.email,
        role: body.role
    }

    if (body.password) {
        updateData.password = await bcrypt.hash(body.password, 10)
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData
    })

    return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
    }
})

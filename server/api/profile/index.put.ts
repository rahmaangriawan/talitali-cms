import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session || !session.user?.email) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const body = await readBody(event)

    // Validate
    if (!body.name || !body.email) {
        throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!currentUser) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    // Check if email is being changed and if it's taken
    if (body.email !== currentUser.email) {
        const existing = await prisma.user.findUnique({
            where: { email: body.email }
        })
        if (existing) {
            throw createError({ statusCode: 400, statusMessage: 'Email already taken' })
        }
    }

    const updateData: any = {
        name: body.name,
        email: body.email
    }

    if (body.password) {
        updateData.password = await bcrypt.hash(body.password, 10)
    }

    const updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: updateData
    })

    return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
    }
})

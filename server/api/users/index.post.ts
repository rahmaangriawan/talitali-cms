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

    const body = await readBody(event)

    // Validate
    if (!body.email || !body.password || !body.name || !body.role) {
        throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
    }

    // Check existing
    const existing = await prisma.user.findUnique({
        where: { email: body.email }
    })

    if (existing) {
        throw createError({ statusCode: 400, statusMessage: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const newUser = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: hashedPassword,
            role: body.role
        }
    })

    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    }
})

import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    const email = 'admin@admin.com'
    const password = await bcrypt.hash('admin123', 10)

    try {
        const admin = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password,
                name: 'Super Admin',
                role: 'SUPER_ADMIN'
            }
        })

        return {
            success: true,
            message: 'Seed successful',
            user: {
                email: admin.email,
                name: admin.name,
                role: admin.role
            }
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
})

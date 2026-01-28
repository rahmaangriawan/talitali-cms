import { prisma } from './server/utils/prisma'
import bcrypt from 'bcrypt'

async function seed() {
    const email = 'admin@admin.com'
    const password = await bcrypt.hash('admin123', 10)

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

    console.log('Seed successful: admin@admin.com / admin123')
}

seed()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const page = await prisma.page.findUnique({
        where: { slug: 'home' },
        include: {
            customValues: {
                include: {
                    field: true
                }
            }
        }
    });
    console.log('Home Page:', JSON.stringify(page, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());

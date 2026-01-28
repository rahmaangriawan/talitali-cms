
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fields = [
    { name: 'Benefit 1', slug: 'benefit_1', type: 'TEXT', target: 'PAGE' },
    { name: 'Benefit 2', slug: 'benefit_2', type: 'TEXT', target: 'PAGE' },
    { name: 'Benefit 3', slug: 'benefit_3', type: 'TEXT', target: 'PAGE' },
    { name: 'Benefit 4', slug: 'benefit_4', type: 'TEXT', target: 'PAGE' }
];

async function seed() {
    console.log('Adding benefit fields...');
    for (const f of fields) {
        const res = await prisma.customField.upsert({
            where: { slug: f.slug },
            update: f,
            create: f
        });
        console.log('Upserted:', res.slug);
    }
    console.log('Benefit fields added successfully');
}

seed().catch(console.error).finally(() => prisma.$disconnect());

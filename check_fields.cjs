
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const fields = await prisma.customField.findMany();
    console.log('Fields count:', fields.length);
    console.log('Fields:', JSON.stringify(fields, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());

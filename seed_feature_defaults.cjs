
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedDefaults() {
    console.log('Seeding default feature values...');

    const features = [
        { title: 'Minimal Order Rendah', desc: 'Spesialisasi cetak custom mulai dari 10 pcs saja.', icon: 'lucide:mouse-pointer' },
        { title: 'Pengiriman Cepat', desc: 'Terintegrasi JNE, Tiki & Indah Cargo ke seluruh Indonesia.', icon: 'lucide:truck' },
        { title: 'Bergaransi 100%', desc: 'Jaminan ganti baru jika ada produk rusak atau cacat.', icon: 'lucide:shield-check' },
        { title: 'Harga Terjangkau', desc: 'Lanyard berkualitas tinggi dengan harga yang sangat kompetitif.', icon: 'lucide:credit-card' },
        { title: 'Warna Akurat', desc: 'Dicetak detail dengan mesin Epson Sure Colour F6270.', icon: 'lucide:palette' },
        { title: 'Pemesanan Online', desc: 'Desain custom sendiri dengan proses pemesanan praktis.', icon: 'lucide:clock' }
    ];

    // Get homepage
    const homePage = await prisma.page.findUnique({
        where: { slug: 'home' }
    });

    if (!homePage) {
        console.log('Homepage not found');
        return;
    }

    // Delete existing feature values
    await prisma.customFieldValue.deleteMany({
        where: {
            pageId: homePage.id,
            field: {
                slug: {
                    startsWith: 'feature_'
                }
            }
        }
    });

    // Insert new values
    for (let i = 0; i < features.length; i++) {
        const num = i + 1;
        const feature = features[i];

        // Get field IDs
        const titleField = await prisma.customField.findUnique({ where: { slug: `feature_${num}_title` } });
        const descField = await prisma.customField.findUnique({ where: { slug: `feature_${num}_desc` } });
        const iconField = await prisma.customField.findUnique({ where: { slug: `feature_${num}_icon` } });

        if (titleField) {
            await prisma.customFieldValue.create({
                data: { fieldId: titleField.id, pageId: homePage.id, value: feature.title }
            });
            console.log(`Set feature ${num} title: ${feature.title}`);
        }

        if (descField) {
            await prisma.customFieldValue.create({
                data: { fieldId: descField.id, pageId: homePage.id, value: feature.desc }
            });
            console.log(`Set feature ${num} desc`);
        }

        if (iconField) {
            await prisma.customFieldValue.create({
                data: { fieldId: iconField.id, pageId: homePage.id, value: feature.icon }
            });
            console.log(`Set feature ${num} icon: ${feature.icon}`);
        }
    }

    console.log('Default features seeded successfully!');
}

seedDefaults().catch(console.error).finally(() => prisma.$disconnect());

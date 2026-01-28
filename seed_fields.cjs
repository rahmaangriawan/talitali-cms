
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fields = [
    { name: 'Hero Tag', slug: 'hero_tag', type: 'TEXT', target: 'PAGE' },
    { name: 'Hero Title', slug: 'hero_title', type: 'TEXT', target: 'PAGE' },
    { name: 'Hero Description', slug: 'hero_description', type: 'TEXTAREA', target: 'PAGE' },
    { name: 'Hero Image', slug: 'hero_image', type: 'IMAGE', target: 'PAGE' },
    { name: 'Hero Stats Text', slug: 'hero_stats_text', type: 'TEXT', target: 'PAGE' },
    { name: 'About Title', slug: 'about_title', type: 'TEXT', target: 'PAGE' },
    { name: 'About Content', slug: 'about_content', type: 'TEXTAREA', target: 'PAGE' },
    { name: 'About Image', slug: 'about_image', type: 'IMAGE', target: 'PAGE' },
    { name: 'About Stat Value', slug: 'about_stat_value', type: 'TEXT', target: 'PAGE' },
    { name: 'About Stat Label', slug: 'about_stat_label', type: 'TEXT', target: 'PAGE' },
    { name: 'Features Title', slug: 'features_title', type: 'TEXT', target: 'PAGE' },
    { name: 'Features Description', slug: 'features_description', type: 'TEXTAREA', target: 'PAGE' },
    { name: 'Pricing Title', slug: 'pricing_title', type: 'TEXT', target: 'PAGE' },
    { name: 'Pricing Description', slug: 'pricing_description', type: 'TEXTAREA', target: 'PAGE' },
    { name: 'Testimonials Title', slug: 'testimonials_title', type: 'TEXT', target: 'PAGE' },
    { name: 'Testimonials Description', slug: 'testimonials_description', type: 'TEXTAREA', target: 'PAGE' },
    { name: 'FAQ Title', slug: 'faq_title', type: 'TEXT', target: 'PAGE' }
];

async function seed() {
    console.log('Starting seed...');
    for (const f of fields) {
        const res = await prisma.customField.upsert({
            where: { slug: f.slug },
            update: f,
            create: f
        });
        console.log('Upserted:', res.slug);
    }
    console.log('All homepage custom fields seeded');
}

seed().catch(console.error).finally(() => prisma.$disconnect());


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fields = [
    // Features fields (6 features)
    { name: 'Feature 1 Title', slug: 'feature_1_title', type: 'TEXT', target: 'PAGE' },
    { name: 'Feature 1 Description', slug: 'feature_1_desc', type: 'TEXTAREA', target: 'PAGE' },
    { name: 'Feature 1 Icon', slug: 'feature_1_icon', type: 'TEXT', target: 'PAGE' },

    { name: 'Feature 2 Title', slug: 'feature_2_title', type: 'TEXT', target: 'PAGE' },
    { name: 'Feature 2 Description', slug: 'feature_2_desc', type: 'TEXTAREA', target: 'PAGE' },
    { name: 'Feature 2 Icon', slug: 'feature_2_icon', type: 'TEXT', target: 'PAGE' },

    { name: 'Feature 3 Title', slug: 'feature_3_title', type: 'TEXT', target: 'PAGE' },
    { name: 'Feature 3 Description', slug: 'feature_3_desc', type: 'TEXTAREA', target: 'PAGE' },
    { name: 'Feature 3 Icon', slug: 'feature_3_icon', type: 'TEXT', target: 'PAGE' },

    { name: 'Feature 4 Title', slug: 'feature_4_title', type: 'TEXT', target: 'PAGE' },
    { name: 'Feature 4 Description', slug: 'feature_4_desc', type: 'TEXTAREA', target: 'PAGE' },
    { name: 'Feature 4 Icon', slug: 'feature_4_icon', type: 'TEXT', target: 'PAGE' },

    { name: 'Feature 5 Title', slug: 'feature_5_title', type: 'TEXT', target: 'PAGE' },
    { name: 'Feature 5 Description', slug: 'feature_5_desc', type: 'TEXTAREA', target: 'PAGE' },
    { name: 'Feature 5 Icon', slug: 'feature_5_icon', type: 'TEXT', target: 'PAGE' },

    { name: 'Feature 6 Title', slug: 'feature_6_title', type: 'TEXT', target: 'PAGE' },
    { name: 'Feature 6 Description', slug: 'feature_6_desc', type: 'TEXTAREA', target: 'PAGE' },
    { name: 'Feature 6 Icon', slug: 'feature_6_icon', type: 'TEXT', target: 'PAGE' },

    // Pricing fields (3 pricing cards)
    { name: 'Pricing 1 Title', slug: 'pricing_1_title', type: 'TEXT', target: 'PAGE' },
    { name: 'Pricing 1 Subtitle', slug: 'pricing_1_subtitle', type: 'TEXT', target: 'PAGE' },
    { name: 'Pricing 1 Price', slug: 'pricing_1_price', type: 'TEXT', target: 'PAGE' },
    { name: 'Pricing 1 Features', slug: 'pricing_1_features', type: 'TEXTAREA', target: 'PAGE' },

    { name: 'Pricing 2 Title', slug: 'pricing_2_title', type: 'TEXT', target: 'PAGE' },
    { name: 'Pricing 2 Subtitle', slug: 'pricing_2_subtitle', type: 'TEXT', target: 'PAGE' },
    { name: 'Pricing 2 Price', slug: 'pricing_2_price', type: 'TEXT', target: 'PAGE' },
    { name: 'Pricing 2 Features', slug: 'pricing_2_features', type: 'TEXTAREA', target: 'PAGE' },

    { name: 'Pricing 3 Title', slug: 'pricing_3_title', type: 'TEXT', target: 'PAGE' },
    { name: 'Pricing 3 Subtitle', slug: 'pricing_3_subtitle', type: 'TEXT', target: 'PAGE' },
    { name: 'Pricing 3 Price', slug: 'pricing_3_price', type: 'TEXT', target: 'PAGE' },
    { name: 'Pricing 3 Features', slug: 'pricing_3_features', type: 'TEXTAREA', target: 'PAGE' }
];

async function seed() {
    console.log('Adding features and pricing fields...');
    for (const f of fields) {
        const res = await prisma.customField.upsert({
            where: { slug: f.slug },
            update: f,
            create: f
        });
        console.log('Upserted:', res.slug);
    }
    console.log('Features and pricing fields added successfully');
}

seed().catch(console.error).finally(() => prisma.$disconnect());

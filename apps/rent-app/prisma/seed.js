const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    const realtors = [
        {
            name: 'Raj Patel',
            email: 'raj.patel@example.com',
            languages: 'English, Hindi, Gujarati',
            city: 'Frisco',
            state: 'TX',
            license: 'TX-123456',
            brokerage: 'Prem Realty',
        },
        {
            name: 'Priya Sharma',
            email: 'priya.sharma@example.com',
            languages: 'English, Hindi, Punjabi',
            city: 'Dallas',
            state: 'TX',
            license: 'TX-654321',
            brokerage: 'Lone Star Homes',
        },
        {
            name: 'Suresh Reddy',
            email: 'suresh.reddy@example.com',
            languages: 'English, Telugu',
            city: 'Irving',
            state: 'TX',
            license: 'TX-987654',
            brokerage: 'Reddy Realty',
        },
        {
            name: 'Anita Desai',
            email: 'anita.desai@example.com',
            languages: 'English, Hindi, Marathi',
            city: 'Jersey City',
            state: 'NJ',
            license: 'NJ-112233',
            brokerage: 'Garden State Properties',
        },
    ];

    for (const r of realtors) {
        const user = await prisma.user.upsert({
            where: { email: r.email },
            update: {},
            create: {
                email: r.email,
                name: r.name,
                role: 'REALTOR',
                realtorProfile: {
                    create: {
                        licenseNumber: r.license,
                        brokerage: r.brokerage,
                        languages: r.languages,
                        experienceYears: 5,
                        states: r.state,
                        cities: r.city,
                        bio: `Experienced realtor serving the ${r.city} community.`,
                        isVerified: true,
                    },
                },
            },
        });
        console.log(`Created realtor: ${user.name}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: { email: 'verified-agent@nivasa.com' },
        update: {},
        create: {
            email: 'verified-agent@nivasa.com',
            name: 'Sarah Jenkins',
            role: 'REALTOR',
            balance: 100,
        },
    });

    const profile = await prisma.realtorProfile.upsert({
        where: { userId: user.id },
        update: {
            isVerified: true,
            priceRange: "$400k - $1.5M",
            bio: "Sarah Jenkins is a top-performing real estate agent in the Dallas-Fort Worth area. With over 12 years of experience, she specialized in residential sales and first-time home buyers. Sarah is known for her transparent communication and data-driven approach to the market.",
        },
        create: {
            userId: user.id,
            licenseNumber: "7654321",
            brokerage: "Jenkins & Co. Real Estate",
            languages: "English, Spanish",
            experienceYears: 12,
            states: "TX",
            cities: "Dallas, Plano, Frisco",
            isVerified: true,
            priceRange: "$400k - $1.5M",
            bio: "Sarah Jenkins is a top-performing real estate agent in the Dallas-Fort Worth area. With over 12 years of experience, she specialized in residential sales and first-time home buyers. Sarah is known for her transparent communication and data-driven approach to the market.",
        },
    });

    console.log('Seeded verified agent:', user.email, profile.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

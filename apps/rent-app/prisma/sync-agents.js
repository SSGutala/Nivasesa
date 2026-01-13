const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const applications = await prisma.realtorApplication.findMany();
    console.log(`Found ${applications.length} applications to sync.`);

    for (const app of applications) {
        console.log(`Syncing ${app.email}...`);
        const user = await prisma.user.upsert({
            where: { email: app.email.toLowerCase() },
            update: { role: 'REALTOR', name: app.fullName },
            create: {
                email: app.email.toLowerCase(),
                name: app.fullName,
                role: 'REALTOR',
            }
        });

        await prisma.realtorProfile.upsert({
            where: { userId: user.id },
            update: {
                isVerified: true,
                licenseNumber: app.licenseNumber,
                brokerage: app.brokerageName,
                languages: app.languages,
                experienceYears: parseInt(app.experienceYears) || 0,
                states: app.statesLicensed,
                cities: app.primaryMarkets,
                buyerTypes: app.buyerSpecializations,
                bio: app.additionalContext || `Professional Realtor serving ${app.primaryMarkets}. Licensed in ${app.statesLicensed}.`,
            },
            create: {
                userId: user.id,
                licenseNumber: app.licenseNumber,
                brokerage: app.brokerageName,
                languages: app.languages,
                experienceYears: parseInt(app.experienceYears) || 0,
                states: app.statesLicensed,
                cities: app.primaryMarkets,
                buyerTypes: app.buyerSpecializations,
                isVerified: true,
                bio: app.additionalContext || `Professional Realtor serving ${app.primaryMarkets}. Licensed in ${app.statesLicensed}.`,
            }
        });
    }

    console.log('Sync complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

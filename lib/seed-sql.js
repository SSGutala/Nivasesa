const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const leads = [
    {
        buyerName: "Amit Sharma",
        buyerContact: "amit.sharma@example.com",
        city: "Frisco",
        zipcode: "75024",
        lat: 33.0697,
        lng: -96.8228,
        buyerType: "First-time home buyer",
        languagePreference: "Hindi, English",
        timeline: "3 months",
        status: "locked",
    },
    {
        buyerName: "Priya Patel",
        buyerContact: "priya.patel@example.com",
        city: "Plano",
        zipcode: "75024",
        lat: 33.1, // Near original
        lng: -96.8,
        buyerType: "Investor",
        languagePreference: "Gujarati, English",
        timeline: "Immediate",
        status: "locked",
    },
    {
        buyerName: "Raj Malhotra",
        buyerContact: "raj@example.com",
        city: "Dallas",
        zipcode: "75201",
        lat: 32.7847,
        lng: -96.7970,
        buyerType: "Relocation buyer",
        languagePreference: "Punjabi, English",
        timeline: "6 months",
        status: "locked",
    },
    {
        buyerName: "Sonia Gupta",
        buyerContact: "sonia@example.com",
        city: "Frisco North",
        zipcode: "75034",
        lat: 33.1507,
        lng: -96.8236,
        buyerType: "First-time home buyer",
        languagePreference: "Hindi",
        timeline: "1 month",
        status: "locked",
    },
    {
        buyerName: "John Doe",
        buyerContact: "john@example.com",
        city: "Austin",
        zipcode: "78701",
        lat: 30.2672,
        lng: -97.7431,
        buyerType: "Vacation home",
        languagePreference: "English",
        timeline: "12 months",
        status: "locked",
    }
];

async function seed() {
    console.log('Cleaning leads and seeding with coordinates...');
    await prisma.lead.deleteMany();

    for (const lead of leads) {
        await prisma.lead.create({
            data: lead
        });
    }

    // Also seed a test user with balance
    await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: { balance: 500, role: 'REALTOR' },
        create: {
            email: 'test@example.com',
            name: 'Test Realtor',
            balance: 500,
            role: 'REALTOR'
        }
    });

    console.log('Done!');
}

seed()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleListings = [
    {
        city: 'Jersey City',
        state: 'NJ',
        zipcode: '07302',
        neighborhood: 'Journal Square',
        title: 'Modern Room in Journal Square',
        description: 'A beautiful, quiet room in the heart of Jersey City. Perfect for working professionals. Close to PATH station.',
        roomType: 'Private Room',
        propertyType: 'Apartment',
        totalBedrooms: 3,
        totalBathrooms: 2,
        rent: 1150,
        deposit: 1150,
        furnished: true,
        parking: false,
        laundryInUnit: true,
        utilities: 'Water,Internet',
        amenities: 'AC,Dishwasher,Modern Kitchen',
        // Freedom Score factors
        overnightGuests: 'Occasional',
        partnerVisits: 'Regular OK',
        partiesAllowed: 'Small OK',
        nightOwlFriendly: true,
        smokingPolicy: 'No Smoking',
        cannabisPolicy: 'No Cannabis',
        alcoholPolicy: 'Social OK',
        dietaryPreference: 'Vegetarian Only',
        beefPorkCookingOk: false,
        fullKitchenAccess: true,
        landlordOnSite: false,
        lgbtqFriendly: true,
        petsPolicy: 'No Pets',
        languages: 'Tamil,Hindi,English',
        availableFrom: new Date(),
        minLease: '12 months',
        photos: JSON.stringify([
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
        ]),
        freedomScore: 65,
    },
    {
        city: 'Manhattan',
        state: 'NY',
        zipcode: '10019',
        neighborhood: 'Midtown',
        title: 'Spacious Midtown Room with View',
        description: 'Spacious room in a luxury building. Seeking a clean and respectful roommate. Great subway access.',
        roomType: 'Private Room',
        propertyType: 'Condo',
        totalBedrooms: 2,
        totalBathrooms: 2,
        rent: 1425,
        deposit: 2850,
        furnished: true,
        parking: false,
        laundryInUnit: false,
        utilities: 'All included',
        amenities: 'Doorman,Gym,Rooftop',
        overnightGuests: 'Anytime OK',
        partnerVisits: 'Anytime OK',
        partiesAllowed: 'Medium OK',
        nightOwlFriendly: true,
        smokingPolicy: 'No Smoking',
        cannabisPolicy: 'Outside Only',
        alcoholPolicy: 'No Preference',
        dietaryPreference: 'No Preference',
        beefPorkCookingOk: false,
        fullKitchenAccess: true,
        landlordOnSite: false,
        lgbtqFriendly: true,
        petsPolicy: 'Cats OK',
        preferredGender: 'Female',
        languages: 'Telugu,Kannada,English',
        availableFrom: new Date(),
        minLease: '6 months',
        photos: JSON.stringify([
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
        ]),
        freedomScore: 78,
    },
    {
        city: 'Manhattan',
        state: 'NY',
        zipcode: '10024',
        neighborhood: 'Upper West Side',
        title: 'Upper West Side Shared Space',
        description: 'Beautiful garden apartment on the UWS. Close to Central Park. Family-friendly environment.',
        roomType: 'Private Room',
        propertyType: 'House',
        totalBedrooms: 4,
        totalBathrooms: 2,
        rent: 1800,
        deposit: 1800,
        furnished: false,
        parking: true,
        laundryInUnit: true,
        utilities: 'Water,Gas',
        amenities: 'Garden,Full Kitchen,Quiet Street',
        overnightGuests: 'No Overnight',
        partnerVisits: 'Occasional OK',
        partiesAllowed: 'No Parties',
        curfew: '11pm',
        nightOwlFriendly: false,
        smokingPolicy: 'No Smoking',
        cannabisPolicy: 'No Cannabis',
        alcoholPolicy: 'No Alcohol',
        dietaryPreference: 'Vegetarian Only',
        beefPorkCookingOk: false,
        fullKitchenAccess: true,
        landlordOnSite: true,
        lgbtqFriendly: true,
        petsPolicy: 'No Pets',
        languages: 'Gujarati,Hindi,English',
        availableFrom: new Date(),
        minLease: '12 months',
        photos: JSON.stringify([
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800',
        ]),
        freedomScore: 35,
    },
    {
        city: 'Frisco',
        state: 'TX',
        zipcode: '75034',
        neighborhood: 'Stonebriar',
        title: 'Modern Tech Hub Room',
        description: 'Perfect for tech professionals. Fast internet, quiet neighborhood, close to Toyota HQ.',
        roomType: 'Private Room',
        propertyType: 'Apartment',
        totalBedrooms: 2,
        totalBathrooms: 2,
        rent: 950,
        deposit: 950,
        furnished: true,
        parking: true,
        laundryInUnit: true,
        utilities: 'Internet',
        amenities: 'Pool,Gym,High-speed Internet',
        overnightGuests: 'Regular',
        partnerVisits: 'Anytime OK',
        partiesAllowed: 'Small OK',
        nightOwlFriendly: true,
        smokingPolicy: 'No Smoking',
        cannabisPolicy: 'No Cannabis',
        alcoholPolicy: 'Social OK',
        dietaryPreference: 'No Preference',
        beefPorkCookingOk: true,
        fullKitchenAccess: true,
        landlordOnSite: false,
        lgbtqFriendly: true,
        petsPolicy: 'Dogs OK',
        languages: 'Hindi,English',
        availableFrom: new Date(),
        minLease: '6 months',
        photos: JSON.stringify([
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
        ]),
        freedomScore: 72,
    },
    {
        city: 'Irving',
        state: 'TX',
        zipcode: '75039',
        neighborhood: 'Las Colinas',
        title: 'Cozy Room Near Las Colinas',
        description: 'Quiet, professional environment. Easy access to DFW airport and major highways.',
        roomType: 'Private Room',
        propertyType: 'Townhouse',
        totalBedrooms: 3,
        totalBathrooms: 2.5,
        rent: 875,
        deposit: 875,
        furnished: false,
        parking: true,
        laundryInUnit: true,
        utilities: 'Water',
        amenities: 'Garage,Backyard',
        overnightGuests: 'Occasional',
        partnerVisits: 'Regular OK',
        partiesAllowed: 'No Parties',
        nightOwlFriendly: false,
        smokingPolicy: 'Outside Only',
        cannabisPolicy: 'No Cannabis',
        alcoholPolicy: 'Social OK',
        dietaryPreference: 'Halal Only',
        beefPorkCookingOk: false,
        fullKitchenAccess: true,
        landlordOnSite: false,
        lgbtqFriendly: true,
        petsPolicy: 'No Pets',
        languages: 'Urdu,Hindi,English',
        availableFrom: new Date(),
        minLease: '12 months',
        photos: JSON.stringify([
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
        ]),
        freedomScore: 48,
    },
];

async function main() {
    console.log('Seeding room listings...');

    // First, get or create a demo user to own the listings
    let demoUser = await prisma.user.findFirst({
        where: { email: 'demo@nivaesa.com' },
    });

    if (!demoUser) {
        demoUser = await prisma.user.create({
            data: {
                email: 'demo@nivaesa.com',
                name: 'Demo Host',
                role: 'BUYER',
            },
        });
        console.log('Created demo user');
    }

    // Create listings
    for (const listing of sampleListings) {
        const existing = await prisma.roomListing.findFirst({
            where: { title: listing.title },
        });

        if (!existing) {
            await prisma.roomListing.create({
                data: {
                    ...listing,
                    ownerId: demoUser.id,
                },
            });
            console.log(`Created: ${listing.title}`);
        } else {
            console.log(`Skipped (exists): ${listing.title}`);
        }
    }

    console.log('Done seeding!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

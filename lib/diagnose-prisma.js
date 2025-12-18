const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    console.log('Prisma Client Version:', require('@prisma/client/package.json').version);

    // Check DMMF (Internal metadata)
    const models = prisma._getDmmf ? await prisma._getDmmf() : prisma._dmmf;
    const userModel = models.modelMap ? models.modelMap.User : models.datamodel.models.find(m => m.name === 'User');

    if (userModel) {
        console.log('User Model Fields:', (userModel.fields || userModel.fields.map(f => f.name)).join(', '));
    } else {
        console.log('User Model not found');
    }
}

check().catch(console.error).finally(() => prisma.$disconnect());

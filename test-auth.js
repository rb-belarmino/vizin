const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  // Check users
  const users = await prisma.user.findMany();
  console.log("Users:", users.map(u => ({ email: u.email, apt: u.apartmentId, hasPass: !!u.passwordHash })));
}
run();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log("Users in DB:");
  users.forEach(u => console.log(`- ID: ${u.id} | Email: ${u.email} | Apt: ${u.apartmentId} | Name: ${u.fullName}`));
  
  const accounts = await prisma.account.findMany();
  console.log("\nAccounts in DB:");
  accounts.forEach(a => console.log(`- Provider: ${a.provider} | UserID: ${a.userId}`));
}
main().catch(console.error).finally(() => prisma.$disconnect());

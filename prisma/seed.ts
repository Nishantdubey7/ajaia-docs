import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_USERS = [
  { name: "Nishant Dubey", email: "nishant@ajaia.dev" },
  { name: "Rahul Sharma", email: "rahul@ajaia.dev" },
  { name: "Priya Mehta", email: "priya@ajaia.dev" },
];

async function main() {
  for (const user of DEMO_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name },
      create: user,
    });
  }
  console.log(`Seeded ${DEMO_USERS.length} demo users.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

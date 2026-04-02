import { PrismaClient } from '../src/generated/prisma/client.js'

import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing todos
  await prisma.changelog.deleteMany()

  // Create example todos
  const todos = await prisma.changelog.createMany({
    data: [
      { projectId: 1, cvrId: 1, description: "desc for id 1", status: "Executed" },
      { projectId: 2, cvrId: 2, description: "desc for id 2", status: "Pending" },
      { projectId: 3, cvrId: 3, description: "desc for id 3", status: "Approved" },
    ],
  })

  console.log(`✅ Created ${todos.count} todos`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import 'dotenv/config'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from './src/generated/prisma/client'

const adapter = new PrismaNeon({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL!,
})

export const prisma = new PrismaClient({ adapter })

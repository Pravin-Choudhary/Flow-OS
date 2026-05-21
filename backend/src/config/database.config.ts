import { prisma } from "../db";

const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL database successfully via Prisma adapter");
  } catch (error) {
    console.error("Error connecting to PostgreSQL database:", error);
    process.exit(1);
  }
};

export default connectDatabase;


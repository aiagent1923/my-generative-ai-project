import { PrismaClient } from "@prisma/client";
import { environment } from "./environment";

if (!environment.databaseUrl) {
  console.warn("⚠️  DATABASE_URL is not set. Prisma client may fail to connect.");
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export const connectPrisma = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to the database");
  } catch (error) {
    console.error("❌ Failed to connect to the database", error);
    throw error;
  }
};

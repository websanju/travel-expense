import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL;

  if (dbUrl) {
    // Pass the DB URL as a runtime datasource override. This is a safe way to provide
    // the connection string to the client without requiring a custom driver adapter.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new PrismaClient({ datasources: { db: { url: dbUrl } } } as any);
  }

  return new PrismaClient();
}

export const prisma =
  globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
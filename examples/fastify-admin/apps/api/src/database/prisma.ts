import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

export function createPrismaClient() {
  const max = Number.parseInt(process.env.DB_POOL_MAX ?? '5', 10);
  const adapter = process.env.DATABASE_URL
    ? new PrismaPg({
        connectionString: process.env.DATABASE_URL,
        max,
        connectionTimeoutMillis: 5_000,
        idleTimeoutMillis: 30_000
      })
    : new PrismaPg({
        host: process.env.DB_SOCKET_PATH,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        max,
        connectionTimeoutMillis: 5_000,
        idleTimeoutMillis: 30_000
      });

  return new PrismaClient({ adapter });
}

export type AppPrismaClient = ReturnType<typeof createPrismaClient>;

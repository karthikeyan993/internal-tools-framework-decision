import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required to seed PostgreSQL.');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

await prisma.accessRequest.createMany({
  skipDuplicates: true,
  data: [
    { id: '018f94d8-e6b2-7c91-8f3a-5db144f7d101', requesterName: 'Asha Nair', requesterEmail: 'asha@example.com', systemName: 'Finance Console', reason: 'Quarter-end reconciliation and variance investigation.' },
    { id: '018f94d8-e6b2-7c91-8f3a-5db144f7d102', requesterName: 'Mateo Silva', requesterEmail: 'mateo@example.com', systemName: 'Customer Data Hub', reason: 'Support escalation analysis for enterprise accounts.' },
    { id: '018f94d8-e6b2-7c91-8f3a-5db144f7d103', requesterName: 'Priya Raman', requesterEmail: 'priya@example.com', systemName: 'Vendor Portal', reason: 'Review and approve onboarding documentation.', status: 'APPROVED', reviewerNote: 'Approved for the procurement rotation.', version: 2 }
  ]
});

await prisma.$disconnect();

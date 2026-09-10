import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { MemoryAccessRequestRepository } from '../access-requests/memory.repository.js';
import { PrismaAccessRequestRepository, type AccessRequestRepository } from '../access-requests/repository.js';
import { createPrismaClient, type AppPrismaClient } from './prisma.js';

@Injectable()
export class DatabaseLifecycleService implements OnModuleInit, OnModuleDestroy {
  readonly repository: AccessRequestRepository;
  private readonly prisma: AppPrismaClient | undefined;

  constructor() {
    if ((process.env.DATABASE_MODE ?? 'memory') === 'memory') {
      this.repository = new MemoryAccessRequestRepository();
      return;
    }
    this.prisma = createPrismaClient();
    this.repository = new PrismaAccessRequestRepository(this.prisma);
  }

  async onModuleInit() {
    await this.prisma?.$connect();
  }

  async onModuleDestroy() {
    await this.prisma?.$disconnect();
  }
}

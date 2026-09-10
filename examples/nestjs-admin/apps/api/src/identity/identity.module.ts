import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DemoIdentityGuard } from './demo-identity.guard.js';

@Module({
  providers: [{ provide: APP_GUARD, useClass: DemoIdentityGuard }]
})
export class IdentityModule {}

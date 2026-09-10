import path from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AccessRequestsModule } from './access-requests/access-requests.module.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthController } from './health.controller.js';
import { IdentityModule } from './identity/identity.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: process.env.WEB_DIST_DIR ?? path.join(import.meta.dirname, '../../web/dist'),
      exclude: /^\/api(?:\/.*)?$/,
      serveStaticOptions: { immutable: true, maxAge: '30d' }
    }),
    DatabaseModule,
    IdentityModule,
    AccessRequestsModule
  ],
  controllers: [HealthController]
})
export class AppModule {}

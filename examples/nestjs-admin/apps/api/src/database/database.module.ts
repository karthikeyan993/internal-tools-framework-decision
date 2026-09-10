import { Global, Module } from '@nestjs/common';
import { ACCESS_REQUEST_REPOSITORY } from './database.constants.js';
import { DatabaseLifecycleService } from './database-lifecycle.service.js';

@Global()
@Module({
  providers: [
    DatabaseLifecycleService,
    {
      provide: ACCESS_REQUEST_REPOSITORY,
      inject: [DatabaseLifecycleService],
      useFactory: (database: DatabaseLifecycleService) => database.repository
    }
  ],
  exports: [ACCESS_REQUEST_REPOSITORY]
})
export class DatabaseModule {}

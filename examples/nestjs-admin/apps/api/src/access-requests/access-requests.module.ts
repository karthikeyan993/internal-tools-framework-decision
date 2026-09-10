import { Module } from '@nestjs/common';
import { AccessRequestsController, SummaryController } from './access-requests.controller.js';
import { AccessRequestsService } from './access-requests.service.js';

@Module({
  controllers: [AccessRequestsController, SummaryController],
  providers: [AccessRequestsService]
})
export class AccessRequestsModule {}

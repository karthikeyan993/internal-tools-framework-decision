import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Query } from '@nestjs/common';
import type { RequestFilters } from '@comparison/contracts';
import { CurrentPrincipal, type Principal } from '../identity/principal.js';
import { AccessRequestsService } from './access-requests.service.js';
import { ListRequestsDto } from './dto/list-requests.dto.js';
import { ReviewRequestDto } from './dto/review-request.dto.js';

@Controller('api/requests')
export class AccessRequestsController {
  constructor(private readonly service: AccessRequestsService) {}

  @Get()
  list(@Query() query: ListRequestsDto) {
    const filters: RequestFilters = { page: query.page, pageSize: query.pageSize, ...(query.query ? { query: query.query } : {}), ...(query.status ? { status: query.status } : {}) };
    return this.service.list(filters);
  }

  @Get(':id')
  get(@Param('id', new ParseUUIDPipe()) id: string) { return this.service.get(id); }

  @Patch(':id/review')
  review(@CurrentPrincipal() principal: Principal, @Param('id', new ParseUUIDPipe()) id: string, @Body() input: ReviewRequestDto) {
    return this.service.review(principal, id, input);
  }
}

@Controller('api/summary')
export class SummaryController {
  constructor(private readonly service: AccessRequestsService) {}
  @Get() get() { return this.service.summary(); }
}

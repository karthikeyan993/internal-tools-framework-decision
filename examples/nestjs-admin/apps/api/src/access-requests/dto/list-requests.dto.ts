import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { requestStatuses, type RequestStatus } from '@comparison/contracts';

export class ListRequestsDto {
  @IsOptional() @IsString() @MaxLength(120)
  query?: string;

  @IsOptional() @IsEnum(requestStatuses)
  status?: RequestStatus;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50)
  pageSize = 20;
}

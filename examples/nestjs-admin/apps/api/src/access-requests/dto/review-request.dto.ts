import { IsEnum, IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { decisions, type ReviewDecision } from '@comparison/contracts';

export class ReviewRequestDto {
  @IsEnum(decisions)
  decision!: ReviewDecision;

  @IsString() @MinLength(3) @MaxLength(500)
  note!: string;

  @IsInt() @Min(1)
  version!: number;
}

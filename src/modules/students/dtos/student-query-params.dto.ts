import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { State } from 'src/commons/types/types';
import type { ClassCode, SectionCode } from 'src/modules/classes/types';
import { CLASS_CODES } from 'src/modules/classes/types';

export class StudentQueryParams {
  @ApiPropertyOptional({
    example: 42,
    description: 'Filter by roll number (exact match)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rollNumber?: number;

  @ApiPropertyOptional({
    enum: CLASS_CODES,
    example: '10',
    description: 'Filter by class code',
  })
  @IsOptional()
  @IsString()
  @IsEnum(CLASS_CODES)
  classCode?: ClassCode;

  @ApiPropertyOptional({ example: 'A', description: 'Filter by section code' })
  @IsOptional()
  @IsString()
  sectionCode?: SectionCode;

  @ApiPropertyOptional({
    enum: State,
    example: State.ACTIVE,
    description: 'Filter by active status',
  })
  @IsOptional()
  @IsEnum(State)
  active?: State;

  @ApiPropertyOptional({
    example: 'John',
    description: 'Filter by student first name (fuzzy search)',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Filter by student last name (fuzzy search)',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: '1234567890',
    description: 'Filter by student phone number (fuzzy search)',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'Filter by student email (fuzzy search)',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    description: 'Page number for pagination',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    minimum: 1,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}

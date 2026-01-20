import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from 'src/commons/types/types';

export class PersonQueryParams {
  @ApiPropertyOptional({
    example: 'John',
    description: 'Filter by first name (fuzzy search)',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Filter by last name (fuzzy search)',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: '1234567890',
    description: 'Filter by phone number (fuzzy search)',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'Filter by email (fuzzy search)',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    example: '1990-01-15',
    description: 'Filter by date of birth (exact match)',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    enum: Gender,
    example: Gender.MALE,
    description: 'Filter by gender',
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

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

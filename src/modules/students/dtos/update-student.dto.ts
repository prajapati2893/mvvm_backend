import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { State } from 'src/commons/types/types';
import type { ClassCode, SectionCode } from 'src/modules/classes/types';
import { CLASS_CODES } from 'src/modules/classes/types';
import { UpdateParentDto } from './update-parent.dto';

export class UpdateStudentDto {
  @ApiPropertyOptional({
    type: [UpdateParentDto],
    description:
      'Update relationships (replaces all existing relationships including guardians)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateParentDto)
  relations?: UpdateParentDto[];

  @ApiPropertyOptional({
    enum: CLASS_CODES,
    example: '10',
    description: 'Update class code',
  })
  @IsOptional()
  @IsString()
  @IsEnum(CLASS_CODES)
  classCode?: ClassCode;

  @ApiPropertyOptional({
    example: 'A',
    description: 'Update section code',
  })
  @IsOptional()
  @IsString()
  sectionCode?: SectionCode;

  @ApiPropertyOptional({ example: 42, description: 'Update roll number' })
  @IsOptional()
  @IsNumber()
  rollNumber?: number;

  @ApiPropertyOptional({
    example: '9876543210',
    description: 'Update emergency contact',
  })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiPropertyOptional({
    enum: State,
    example: State.ACTIVE,
    description: 'Update active status',
  })
  @IsOptional()
  @IsEnum(State)
  active?: State;
}

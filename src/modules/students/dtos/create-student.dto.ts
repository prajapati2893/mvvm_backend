import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsOneOf } from 'src/common/validators';
import { State } from 'src/commons/types/types';
import type { ClassCode, SectionCode } from 'src/modules/classes/types';
import { CLASS_CODES } from 'src/modules/classes/types';
import { CreateParentDto } from './create-parent.dto';
import { CreatePersonDto } from './create-person.dto';

export class CreateStudentDto {
  @ApiPropertyOptional({
    example: 1,
    description:
      'Existing person ID (use either personId OR person object, not both)',
  })
  @IsOptional()
  @IsNumber()
  @IsOneOf(['personId', 'person'])
  personId?: number;

  @ApiPropertyOptional({
    type: () => CreatePersonDto,
    description:
      'New person details (use either personId OR person object, not both)',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person?: CreatePersonDto;

  @ApiProperty({
    type: [CreateParentDto],
    description: 'Parent/Guardian relationships (at least one required)',
    minItems: 1,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateParentDto)
  @ArrayMinSize(1, { message: 'At least one relation is required' })
  relations: CreateParentDto[];

  @ApiPropertyOptional({
    example: 2,
    description:
      'Existing guardian person ID (use either guardianId OR guardian object)',
  })
  @IsOptional()
  @IsNumber()
  @IsOneOf(['guardianId', 'guardian'])
  guardianId?: number;

  @ApiPropertyOptional({
    type: () => CreatePersonDto,
    description:
      'New guardian details (use either guardianId OR guardian object)',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  guardian?: CreatePersonDto;

  @ApiProperty({
    enum: CLASS_CODES,
    example: '10',
    description: 'Student class code',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(CLASS_CODES)
  classCode: ClassCode;

  @ApiProperty({ example: 'A', description: 'Student section code' })
  @IsNotEmpty()
  @IsString()
  sectionCode: SectionCode;

  @ApiProperty({ example: 42, description: 'Student roll number' })
  @IsNotEmpty()
  @IsNumber()
  rollNumber: number;

  @ApiPropertyOptional({
    example: '9876543210',
    description: 'Emergency contact number',
  })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiPropertyOptional({
    enum: State,
    example: State.ACTIVE,
    description: 'Student active status',
  })
  @IsOptional()
  @IsEnum(State)
  active?: State;
}

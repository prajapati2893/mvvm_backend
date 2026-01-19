import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CLASS_CODES, type ClassCode } from '../types';

export class CreateClassDto {
  @ApiProperty({
    description: 'Class code',
    enum: CLASS_CODES,
    example: '10',
  })
  @IsNotEmpty()
  @IsEnum(CLASS_CODES, {
    message: 'code must be a valid class code',
  })
  code: ClassCode;

  @ApiProperty({
    description: 'Class name',
    example: 'Class 10th',
  })
  @IsString()
  displayName: string;

  @ApiPropertyOptional({
    description: 'ID of the class teacher',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  classTeacherId?: number;
}

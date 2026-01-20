import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { SECTION_CODES, type SectionCode } from '../types';

export class CreateSectionDto {
  @ApiProperty({
    description: 'Section code (single character)',
    example: 'A',
    minLength: 1,
    maxLength: 1,
  })
  @IsNotEmpty()
  @IsEnum(SECTION_CODES, { message: 'code must be a valid section code' })
  code: SectionCode;
}

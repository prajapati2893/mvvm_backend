import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({
    description: 'Section code (single character)',
    example: 'A',
    minLength: 1,
    maxLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 1)
  code: string;
}

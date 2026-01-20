import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { IsOneOf } from 'src/common/validators';
import { RelationType } from 'src/commons/types/types';
import { CreatePersonDto } from './create-person.dto';

export class CreateParentDto {
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
    enum: [RelationType.MOTHER, RelationType.FATHER, RelationType.GUARDIAN],
    example: RelationType.FATHER,
    description: 'Relationship type',
  })
  @IsNotEmpty()
  @IsEnum(RelationType)
  relationType:
    | RelationType.MOTHER
    | RelationType.FATHER
    | RelationType.GUARDIAN;
}

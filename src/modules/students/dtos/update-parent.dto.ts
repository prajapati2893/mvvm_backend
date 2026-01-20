import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { RelationType } from 'src/commons/types/types';

export class UpdateParentDto {
  @ApiProperty({ example: 1, description: 'Person ID of the parent/guardian' })
  @IsNotEmpty()
  @IsNumber()
  personId: number;

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

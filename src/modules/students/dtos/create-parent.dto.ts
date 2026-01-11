import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { RelationType } from 'src/commons/types/types';
import { CreatePersonDto } from './create-person.dto';

export class CreateParentDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person: CreatePersonDto;

  @IsNotEmpty()
  @IsEnum(RelationType)
  relationType:
    | RelationType.MOTHER
    | RelationType.FATHER
    | RelationType.GUARDIAN;
}

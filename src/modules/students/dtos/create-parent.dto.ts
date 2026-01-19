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
  @IsOptional()
  @IsNumber()
  @IsOneOf(['personId', 'person'])
  personId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person?: CreatePersonDto;

  @IsNotEmpty()
  @IsEnum(RelationType)
  relationType:
    | RelationType.MOTHER
    | RelationType.FATHER
    | RelationType.GUARDIAN;
}

import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { MaritalStatus, State } from 'src/commons/types/types';
import { CreatePersonDto } from '../../students/dtos/create-person.dto';
import { CreateSpouseDto } from './create-spouse.dto';

export class CreateTeacherDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person: CreatePersonDto;

  @ValidateIf(
    (payload: CreateTeacherDto) =>
      payload.person?.maritalStatus === MaritalStatus.MARRIED,
  )
  @IsNotEmpty({ message: 'Spouse is required when marital status is MARRIED' })
  @ValidateNested()
  @Type(() => CreateSpouseDto)
  spouse?: CreateSpouseDto;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  subjectIds?: number[];

  @IsOptional()
  @IsEnum(State)
  state?: State;
}

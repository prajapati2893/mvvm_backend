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
import { State } from 'src/commons/types/types';
import { CreateParentDto } from './create-parent.dto';
import { CreatePersonDto } from './create-person.dto';

export class CreateStudentDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person: CreatePersonDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateParentDto)
  @ArrayMinSize(1, { message: 'At least one relation is required' })
  relations: CreateParentDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  guardian?: CreatePersonDto;

  @IsNotEmpty()
  @IsNumber()
  classId: number;

  @IsNotEmpty()
  @IsNumber()
  sectionId: number;

  @IsNotEmpty()
  @IsNumber()
  rollNumber: number;

  @IsOptional()
  @IsString()
  house?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsEnum(State)
  active?: State;
}

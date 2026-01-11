import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreatePersonDto } from '../../students/dtos/create-person.dto';

export class CreateSpouseDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person: CreatePersonDto;
}

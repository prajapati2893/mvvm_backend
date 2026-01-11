import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  description: string;
}

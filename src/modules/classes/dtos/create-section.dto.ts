import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateSectionDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 1)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  classId: number;
}

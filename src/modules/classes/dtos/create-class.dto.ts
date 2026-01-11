import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  classTeacherId?: number;
}

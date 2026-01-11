import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsOptional()
  @IsString()
  streetTown?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsNotEmpty()
  @IsNumber()
  pin: number;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}

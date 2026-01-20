import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiPropertyOptional({
    example: '123 Main Street, Downtown',
    description: 'Street and town/locality',
  })
  @IsOptional()
  @IsString()
  streetTown?: string;

  @ApiPropertyOptional({ example: 'New York', description: 'City name' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 10001, description: 'PIN/ZIP code' })
  @IsNotEmpty()
  @IsNumber()
  pin: number;

  @ApiProperty({ example: 'New York', description: 'State/Province' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: 'USA', description: 'Country name' })
  @IsNotEmpty()
  @IsString()
  country: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Gender, MaritalStatus } from 'src/commons/types/types';
import { CreateAddressDto } from 'src/modules/students/dtos/create-address.dto';

export class CreatePersonDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: '1990-01-15', type: String })
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @ApiPropertyOptional({ example: 'O+', maxLength: 4 })
  @IsOptional()
  @IsString()
  @Length(1, 4)
  bloodGroup?: string;

  @ApiPropertyOptional({ example: '1234567890', maxLength: 10 })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ type: () => CreateAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({ enum: MaritalStatus, example: MaritalStatus.SINGLE })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Gender, MaritalStatus } from 'src/commons/types/types';
import { CreateAddressDto } from 'src/modules/students/dtos/create-address.dto';

export class UpdatePersonDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ example: '1990-01-15', type: String })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

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

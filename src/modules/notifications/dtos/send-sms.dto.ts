import {
  ArrayNotEmpty,
  IsArray,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class SendSmsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsPhoneNumber('IN', { each: true })
  recipients: string[];

  @IsString()
  message: string;
}

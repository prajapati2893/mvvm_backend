import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateClassDto } from './create-class.dto';

export class UpdateClassDto extends PartialType(
  OmitType(CreateClassDto, ['code'] as const),
) {}

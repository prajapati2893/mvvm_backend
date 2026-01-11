import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Address,
  Person,
  PersonRelationship,
  Subject,
  Teacher,
} from 'src/database/entities';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Teacher,
      Person,
      Address,
      PersonRelationship,
      Subject,
    ]),
  ],
  providers: [TeachersService],
  controllers: [TeachersController],
})
export class TeachersModule {}

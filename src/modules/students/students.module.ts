import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Address,
  Class,
  Person,
  PersonRelationship,
  Section,
  Student,
} from 'src/database/entities';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      Person,
      Address,
      Class,
      Section,
      PersonRelationship,
    ]),
  ],
  providers: [StudentsService],
  controllers: [StudentsController],
})
export class StudentsModule {}

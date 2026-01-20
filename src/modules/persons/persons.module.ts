import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Address,
  Person,
  PersonRelationship,
  Student,
  Teacher,
} from 'src/database/entities';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Person,
      Address,
      Student,
      Teacher,
      PersonRelationship,
    ]),
  ],
  controllers: [PersonsController],
  providers: [PersonsService],
  exports: [PersonsService],
})
export class PersonsModule {}

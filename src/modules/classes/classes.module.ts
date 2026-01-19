import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class, Section, Student, Teacher } from 'src/database/entities';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { SectionsService } from './sections.service';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Teacher, Section, Student])],
  providers: [ClassesService, SectionsService],
  controllers: [ClassesController],
})
export class ClassesModule {}

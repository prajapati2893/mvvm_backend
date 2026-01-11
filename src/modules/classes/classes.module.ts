import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class, Section, Teacher } from 'src/database/entities';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Teacher, Section])],
  providers: [ClassesService, SectionsService],
  controllers: [ClassesController, SectionsController],
})
export class ClassesModule {}

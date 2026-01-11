import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateSubjectDto } from './dtos/create-subject.dto';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    return await this.subjectsService.create(createSubjectDto);
  }

  @Get()
  async findAll() {
    return await this.subjectsService.findAll();
  }
}

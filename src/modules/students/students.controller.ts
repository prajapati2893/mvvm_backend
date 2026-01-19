import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateStudentDto } from './dtos/create-student.dto';
import { StudentsService } from './students.service';
import type { StudentQueryParams } from './types';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentsService.create(createStudentDto);
  }

  @Get()
  async findAll(@Query() params: StudentQueryParams) {
    return await this.studentsService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.studentsService.findOne(id);
  }
}

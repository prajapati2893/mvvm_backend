import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTeacherDto } from './dtos/create-teacher.dto';
import { TeachersService } from './teachers.service';
import type { TeacherQueryParams } from './types';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  async create(@Body() createTeacherDto: CreateTeacherDto) {
    return await this.teachersService.create(createTeacherDto);
  }

  @Get()
  async findAll(@Query() params: TeacherQueryParams) {
    return await this.teachersService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.teachersService.findOne(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateStudentDto } from './dtos/create-student.dto';
import { StudentQueryParams } from './dtos/student-query-params.dto';
import { UpdateStudentDto } from './dtos/update-student.dto';
import { StudentsService } from './students.service';

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

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return await this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.studentsService.remove(id);
  }
}

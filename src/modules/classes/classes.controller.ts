import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Class, Section } from 'src/database/entities';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dtos/create-class.dto';
import { CreateSectionDto } from './dtos/create-section.dto';
import { UpdateClassDto } from './dtos/update-class.dto';
import { SectionsService } from './sections.service';
import type { ClassCode, SectionCode } from './types';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(
    private readonly classesService: ClassesService,
    private readonly sectionsService: SectionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'Class created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createClassDto: CreateClassDto) {
    return await this.classesService.create(createClassDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({ status: 200, description: 'List of all classes' })
  async findAll() {
    return await this.classesService.findAll();
  }

  @Get(':classCode')
  @ApiOperation({ summary: 'Get a class by code' })
  @ApiResponse({ status: 200, description: 'Class found' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async findOne(@Param('classCode', ParseIntPipe) classCode: ClassCode) {
    return await this.classesService.findOne(classCode);
  }

  @Patch(':classCode')
  @ApiOperation({ summary: 'Update a class' })
  @ApiResponse({ status: 200, description: 'Class updated successfully' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('classCode', ParseIntPipe) classCode: ClassCode,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    return await this.classesService.update(classCode, updateClassDto);
  }

  @Delete(':classCode')
  @ApiOperation({ summary: 'Delete a class and all its sections' })
  @ApiResponse({ status: 200, description: 'Class deleted successfully' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete class with enrolled students',
  })
  async remove(@Param('classCode', ParseIntPipe) classCode: ClassCode) {
    return await this.classesService.remove(classCode);
  }

  @Post(':classCode/sections')
  @ApiOperation({ summary: 'Create a new section in a class' })
  @ApiResponse({ status: 201, description: 'Section created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async createSection(
    @Param('classCode', ParseIntPipe) classCode: ClassCode,
    @Body() createSectionDto: CreateSectionDto,
  ): Promise<Section> {
    return await this.sectionsService.createForClass(
      classCode,
      createSectionDto,
    );
  }

  @Get(':classCode/sections')
  @ApiOperation({ summary: 'Get all sections of a class' })
  @ApiResponse({ status: 200, description: 'List of sections for the class' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async findSectionsByClass(
    @Param('classCode', ParseIntPipe) classCode: ClassCode,
  ): Promise<Section[]> {
    return await this.sectionsService.findByClass(classCode);
  }

  @Delete(':classCode/sections/:sectionCode')
  @ApiOperation({ summary: 'Delete a section from a class' })
  @ApiResponse({ status: 200, description: 'Section deleted successfully' })
  @ApiResponse({ status: 404, description: 'Section or class not found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete section with enrolled students',
  })
  async removeSection(
    @Param('classCode', ParseIntPipe) classCode: ClassCode,
    @Param('sectionCode') sectionCode: SectionCode,
  ): Promise<Section> {
    return await this.sectionsService.removeByClassAndCode(
      classCode,
      sectionCode,
    );
  }
}

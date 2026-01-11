import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateSectionDto } from './dtos/create-section.dto';
import { SectionsService } from './sections.service';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  async create(@Body() createSectionDto: CreateSectionDto) {
    return await this.sectionsService.create(createSectionDto);
  }

  @Get()
  async findAll() {
    return await this.sectionsService.findAll();
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePersonDto } from './dtos/create-person.dto';
import { PersonQueryParams } from './dtos/person-query-params.dto';
import { UpdatePersonDto } from './dtos/update-person.dto';
import { PersonsService } from './persons.service';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  async create(@Body() createPersonDto: CreatePersonDto) {
    return await this.personsService.create(createPersonDto);
  }

  @Get()
  async findAll(@Query() params: PersonQueryParams) {
    return await this.personsService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.personsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    return await this.personsService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.personsService.remove(id);
  }
}

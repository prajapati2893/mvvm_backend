import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class, Section } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateSectionDto } from './dtos/create-section.dto';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(createSectionDto: CreateSectionDto) {
    // Get class
    const classEntity = await this.classRepository.findOne({
      where: { id: createSectionDto.classId },
    });

    if (!classEntity) {
      throw new UnprocessableEntityException(
        `Class with ID ${createSectionDto.classId} not found`,
      );
    }

    // Check if section already exists for this class
    const existingSection = await this.sectionRepository.findOne({
      where: {
        name: createSectionDto.name,
        class: { id: createSectionDto.classId },
      },
    });

    if (existingSection) {
      throw new UnprocessableEntityException(
        `Section '${createSectionDto.name}' already exists for class '${classEntity.name}'`,
      );
    }

    // Create section
    const section = this.sectionRepository.create({
      name: createSectionDto.name,
      class: classEntity,
    });

    return await this.sectionRepository.save(section);
  }

  async findAll() {
    return await this.sectionRepository.find({
      relations: ['class'],
    });
  }
}

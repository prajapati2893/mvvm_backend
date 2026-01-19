import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class, Section, Student } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateSectionDto } from './dtos/create-section.dto';
import { ClassCode } from './types';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async createForClass(
    classCode: ClassCode,
    createSectionDto: CreateSectionDto,
  ): Promise<Section> {
    const classEntity = await this.classRepository.findOne({
      where: { code: classCode },
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with code ${classCode} not found`);
    }

    const existingSection = await this.sectionRepository.findOne({
      where: {
        code: createSectionDto.code,
        class: { code: classCode },
      },
    });

    if (existingSection) {
      throw new UnprocessableEntityException(
        `Section '${createSectionDto.code}' already exists for class '${classEntity.displayName}'`,
      );
    }

    const section = this.sectionRepository.create({
      code: createSectionDto.code,
      class: classEntity,
    });

    return await this.sectionRepository.save(section);
  }

  async findByClass(classCode: ClassCode): Promise<Section[]> {
    const classEntity = await this.classRepository.findOne({
      where: { code: classCode },
      relations: ['sections'],
      order: { sections: { code: 'ASC' } },
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with code ${classCode} not found`);
    }

    return classEntity.sections;
  }

  async removeByClassAndCode(
    classCode: ClassCode,
    sectionCode: string,
  ): Promise<Section> {
    const section = await this.sectionRepository.findOne({
      where: {
        code: sectionCode,
        class: { code: classCode },
      },
      relations: ['class'],
    });

    if (!section) {
      throw new NotFoundException(
        `Section ${sectionCode} not found in class ${classCode}`,
      );
    }

    const studentCount = await this.studentRepository.count({
      where: {
        section: { id: section.id },
        class: { id: section.class.id },
      },
    });

    if (studentCount > 0) {
      throw new BadRequestException(
        `Cannot delete section ${section.code} of class ${section.class.displayName}. It has ${studentCount} enrolled student(s). Please remove or reassign students first.`,
      );
    }

    await this.sectionRepository.remove(section);

    return section;
  }
}

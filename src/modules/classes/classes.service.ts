import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class, Section, Teacher } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dtos/create-class.dto';
import { UpdateClassDto } from './dtos/update-class.dto';
import { ClassCode } from './types';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
  ) {}

  async create(createClassDto: CreateClassDto) {
    let classTeacher: Teacher | undefined;

    if (createClassDto.classTeacherId) {
      const teacher = await this.teacherRepository.findOne({
        where: { id: createClassDto.classTeacherId },
      });

      if (!teacher) {
        throw new Error(
          `Teacher with ID ${createClassDto.classTeacherId} not found`,
        );
      }
      classTeacher = teacher;
    }

    const classEntity = this.classRepository.create({
      code: createClassDto.code,
      displayName: createClassDto.displayName,
      classTeacher: classTeacher,
    });

    const savedClass = await this.classRepository
      .save(classEntity)
      .catch((e: Error) => {
        throw new BadRequestException(e.message);
      });

    return savedClass;
  }

  async findAll() {
    return await this.classRepository.find({
      relations: ['classTeacher', 'sections'],
    });
  }

  async findOne(classCode: ClassCode) {
    const classEntity = await this.classRepository.findOne({
      where: { code: classCode },
      relations: [
        'classTeacher',
        'classTeacher.person',
        'sections',
        'students',
      ],
    });

    if (!classEntity) {
      throw new Error(`Class with ID ${classCode} not found`);
    }

    return classEntity;
  }

  async update(
    classCode: ClassCode,
    updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { code: classCode },
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${classCode} not found`);
    }

    if (updateClassDto.classTeacherId !== undefined) {
      const teacher = await this.teacherRepository.findOne({
        where: { id: updateClassDto.classTeacherId },
      });

      if (!teacher) {
        throw new BadRequestException(
          `Teacher with ID ${updateClassDto.classTeacherId} not found`,
        );
      }
      classEntity.classTeacher = teacher;
    }

    if (updateClassDto.displayName !== undefined) {
      classEntity.displayName = updateClassDto.displayName;
    }

    const updatedClass = await this.classRepository
      .save(classEntity)
      .catch((e: Error) => {
        throw new BadRequestException(e.message);
      });

    return updatedClass;
  }

  async remove(classCode: ClassCode): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { code: classCode },
      relations: ['sections', 'students'],
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with code ${classCode} not found`);
    }

    if (classEntity.students && classEntity.students.length > 0) {
      throw new BadRequestException(
        `Cannot delete class ${classEntity.displayName}. It has ${classEntity.students.length} enrolled student(s). Please remove students first.`,
      );
    }

    if (classEntity.sections && classEntity.sections.length > 0) {
      await this.sectionRepository.remove(classEntity.sections);
    }

    await this.classRepository.remove(classEntity);

    return classEntity;
  }
}

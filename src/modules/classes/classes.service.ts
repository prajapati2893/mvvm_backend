import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class, Teacher } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dtos/create-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async create(createClassDto: CreateClassDto) {
    let classTeacher: Teacher | undefined;

    // Get class teacher if provided
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

    // Create class
    const classEntity = this.classRepository.create({
      name: createClassDto.name,
      classTeacher: classTeacher,
    });

    return await this.classRepository.save(classEntity);
  }

  async findAll() {
    return await this.classRepository.find({
      relations: ['classTeacher', 'sections'],
    });
  }

  async findOne(id: number) {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: [
        'classTeacher',
        'classTeacher.person',
        'sections',
        'students',
      ],
    });

    if (!classEntity) {
      throw new Error(`Class with ID ${id} not found`);
    }

    return classEntity;
  }
}

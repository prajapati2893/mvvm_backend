import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateSubjectDto } from './dtos/create-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const subject = this.subjectRepository.create(createSubjectDto);
    return await this.subjectRepository.save(subject);
  }

  async findAll() {
    return await this.subjectRepository.find({
      relations: {
        teachers: {
          person: true,
        },
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MaritalStatus,
  RelationContext,
  RelationType,
  State,
} from 'src/commons/types/types';
import {
  Address,
  Person,
  PersonRelationship,
  Subject,
  Teacher,
} from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateTeacherDto } from './dtos/create-teacher.dto';
import { TeacherQueryParams } from './types';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(PersonRelationship)
    private readonly personRelationshipRepository: Repository<PersonRelationship>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto) {
    let address: Address | undefined;
    if (createTeacherDto.person.address) {
      const newAddress = this.addressRepository.create(
        createTeacherDto.person.address,
      );
      address = await this.addressRepository.save(newAddress);
    }

    const person = this.personRepository.create({
      ...createTeacherDto.person,
      address: address,
    });
    const savedPerson = await this.personRepository.save(person);

    let subjects: Subject[] = [];
    if (createTeacherDto.subjectIds && createTeacherDto.subjectIds.length > 0) {
      subjects = await this.subjectRepository.find({
        where: createTeacherDto.subjectIds.map((id) => ({ id })),
      });

      if (subjects.length !== createTeacherDto.subjectIds.length) {
        throw new Error('One or more subject IDs are invalid');
      }
    }

    const teacher = this.teacherRepository.create({
      person: savedPerson,
      state: createTeacherDto.state ?? State.ACTIVE,
      subjects: subjects,
    });

    const savedTeacher = await this.teacherRepository.save(teacher);

    if (
      createTeacherDto.person.maritalStatus === MaritalStatus.MARRIED &&
      createTeacherDto.spouse
    ) {
      const spouseData = createTeacherDto.spouse;

      let spouseAddress: Address | undefined;
      if (spouseData.person.address) {
        const newSpouseAddress = this.addressRepository.create(
          spouseData.person.address,
        );
        spouseAddress = await this.addressRepository.save(newSpouseAddress);
      }

      const spousePerson = this.personRepository.create({
        ...spouseData.person,
        address: spouseAddress,
      });
      const savedSpousePerson = await this.personRepository.save(spousePerson);

      const spouseRelationship = this.personRelationshipRepository.create({
        sourcePerson: savedSpousePerson,
        targetPerson: savedPerson,
        relationType: RelationType.SPOUSE,
        context: RelationContext.TEACHER,
        contextId: savedTeacher.id,
      });
      await this.personRelationshipRepository.save(spouseRelationship);
    }

    return savedTeacher;
  }

  async findAll(query: TeacherQueryParams) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const totalItems = await this.teacherRepository.count();

    const teachers = await this.teacherRepository.find({
      ...query,
      skip: offset,
      take: limit,
      relations: {
        person: {
          address: true,
        },
        subjects: true,
      },
    });

    const teachersWithRelations = await Promise.all(
      teachers.map(async (teacher) => {
        const relationships = await this.personRelationshipRepository.find({
          where: [
            {
              targetPerson: { id: teacher.person.id },
              context: RelationContext.TEACHER,
            },
            {
              sourcePerson: { id: teacher.person.id },
              context: RelationContext.TEACHER,
            },
          ],
          relations: {
            sourcePerson: {
              address: true,
            },
          },
        });

        return {
          ...teacher,
          relationships,
        };
      }),
    );

    return {
      data: teachersWithRelations,
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  async findOne(id: number) {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: {
        person: {
          address: true,
        },
        subjects: true,
      },
    });

    if (!teacher) {
      return null;
    }

    const relationships = await this.personRelationshipRepository.find({
      where: [
        {
          targetPerson: { id: teacher.person.id },
          context: RelationContext.TEACHER,
        },
        {
          sourcePerson: { id: teacher.person.id },
          context: RelationContext.TEACHER,
        },
      ],
      relations: {
        sourcePerson: {
          address: true,
        },
      },
    });

    return {
      ...teacher,
      relationships,
    };
  }
}

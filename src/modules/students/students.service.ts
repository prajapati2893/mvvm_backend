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
  Class,
  Person,
  PersonRelationship,
  Section,
  Student,
} from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dtos/create-student.dto';
import { StudentQueryParams } from './types';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(PersonRelationship)
    private readonly personRelationshipRepository: Repository<PersonRelationship>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    let address: Address | undefined;
    if (createStudentDto.person.address) {
      const newAddress = this.addressRepository.create(
        createStudentDto.person.address,
      );
      address = await this.addressRepository.save(newAddress);
    }

    const person = this.personRepository.create({
      ...createStudentDto.person,
      address: address,
      maritalStatus:
        createStudentDto.person.maritalStatus ?? MaritalStatus.SINGLE,
    });
    const savedPerson = await this.personRepository.save(person);

    const classEntity = await this.classRepository.findOne({
      where: { id: createStudentDto.classId },
    });
    const section = await this.sectionRepository.findOne({
      where: { id: createStudentDto.sectionId },
    });

    if (!classEntity) {
      throw new Error(`Class with ID ${createStudentDto.classId} not found`);
    }
    if (!section) {
      throw new Error(
        `Section with ID ${createStudentDto.sectionId} not found`,
      );
    }

    const student = this.studentRepository.create({
      person: savedPerson,
      class: classEntity,
      section: section,
      rollNumber: createStudentDto.rollNumber,
      house: createStudentDto.house,
      emergencyContact: createStudentDto.emergencyContact,
      active: createStudentDto.active ?? State.ACTIVE,
    });

    const savedStudent = await this.studentRepository.save(student);

    // Create relations (parents/guardians) and their relationships
    for (const parentDto of createStudentDto.relations) {
      let parentAddress: Address | undefined;
      if (parentDto.person.address) {
        const newParentAddress = this.addressRepository.create(
          parentDto.person.address,
        );
        parentAddress = await this.addressRepository.save(newParentAddress);
      }

      const parentPerson = this.personRepository.create({
        ...parentDto.person,
        address: parentAddress,
      });
      const savedParentPerson = await this.personRepository.save(parentPerson);

      const relationship = this.personRelationshipRepository.create({
        sourcePerson: savedParentPerson,
        targetPerson: savedPerson,
        relationType: parentDto.relationType,
        context: RelationContext.STUDENT,
        contextId: savedStudent.id,
      });
      await this.personRelationshipRepository.save(relationship);
    }

    if (createStudentDto.guardian) {
      let guardianAddress: Address | undefined;
      if (createStudentDto.guardian.address) {
        const newGuardianAddress = this.addressRepository.create(
          createStudentDto.guardian.address,
        );
        guardianAddress = await this.addressRepository.save(newGuardianAddress);
      }

      const guardianPerson = this.personRepository.create({
        ...createStudentDto.guardian,
        address: guardianAddress,
      });
      const savedGuardianPerson =
        await this.personRepository.save(guardianPerson);

      const guardianRelationship = this.personRelationshipRepository.create({
        sourcePerson: savedGuardianPerson,
        targetPerson: savedPerson,
        relationType: RelationType.GUARDIAN,
        context: RelationContext.STUDENT,
        contextId: savedStudent.id,
      });
      await this.personRelationshipRepository.save(guardianRelationship);
    }

    return savedStudent;
  }

  async findAll(query: StudentQueryParams) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const totalItems = await this.studentRepository.count();

    const students = await this.studentRepository.find({
      ...query,
      skip: offset,
      take: limit,
      relations: {
        person: {
          address: true,
        },
        class: true,
        section: true,
      },
    });

    const studentsWithRelations = await Promise.all(
      students.map(async (student) => {
        const relationships = await this.personRelationshipRepository.find({
          where: [
            {
              targetPerson: { id: student.person.id },
              context: RelationContext.STUDENT,
            },
            {
              sourcePerson: { id: student.person.id },
              context: RelationContext.STUDENT,
            },
          ],
          relations: {
            sourcePerson: {
              address: true,
            },
            targetPerson: {
              address: true,
            },
          },
        });

        return {
          ...student,
          relationships,
        };
      }),
    );

    return {
      data: studentsWithRelations,
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  async findOne(id: number) {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: {
        person: {
          address: true,
        },
        class: true,
        section: true,
      },
    });

    if (!student) {
      return null;
    }

    const relationships = await this.personRelationshipRepository.find({
      where: [
        {
          targetPerson: { id: student.person.id },
          context: RelationContext.STUDENT,
        },
        {
          sourcePerson: { id: student.person.id },
          context: RelationContext.STUDENT,
        },
      ],
      relations: {
        sourcePerson: {
          address: true,
        },
        targetPerson: {
          address: true,
        },
      },
    });

    return {
      ...student,
      relationships,
    };
  }
}

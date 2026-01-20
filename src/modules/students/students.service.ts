import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
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
import { DataSource, Like, QueryRunner, Repository } from 'typeorm';
import { ClassCode, SectionCode } from '../classes/types';
import { CreateParentDto } from './dtos/create-parent.dto';
import { CreatePersonDto } from './dtos/create-person.dto';
import { CreateStudentDto } from './dtos/create-student.dto';
import { StudentQueryParams } from './dtos/student-query-params.dto';
import { UpdateStudentDto } from './dtos/update-student.dto';

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
    private readonly dataSource: DataSource,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const studentPerson = await this.resolveOrCreatePerson(
        createStudentDto.personId,
        createStudentDto.person,
        queryRunner,
      );

      // Validate and get class and section
      const { classEntity, section } = await this.validateAndGetClassAndSection(
        createStudentDto.classCode,
        createStudentDto.sectionCode,
      );

      // Create student entity
      const student = queryRunner.manager.create(Student, {
        person: studentPerson,
        class: classEntity,
        section: section,
        rollNumber: createStudentDto.rollNumber,
        emergencyContact: createStudentDto.emergencyContact,
        active: createStudentDto.active ?? State.ACTIVE,
      });
      const savedStudent = await queryRunner.manager.save(Student, student);

      // Create parent/guardian relationships
      await this.createStudentRelationships(
        createStudentDto.relations,
        studentPerson,
        savedStudent.id,
        queryRunner,
      );

      // Create guardian relationship if provided
      if (createStudentDto.guardianId || createStudentDto.guardian) {
        await this.createGuardianRelationship(
          createStudentDto.guardianId,
          createStudentDto.guardian,
          studentPerson,
          savedStudent.id,
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();
      return savedStudent;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async resolveOrCreatePerson(
    personId: number | undefined,
    personDto: CreatePersonDto | undefined,
    queryRunner: QueryRunner,
  ): Promise<Person> {
    if (personId) {
      const existingPerson = await this.personRepository.findOne({
        where: { id: personId },
        relations: { address: true },
      });
      if (!existingPerson) {
        throw new UnprocessableEntityException(
          `Person with ID ${personId} not found`,
        );
      }
      return existingPerson;
    }

    return await this.createPersonWithAddress(personDto!, queryRunner);
  }

  private async createPersonWithAddress(
    personDto: CreatePersonDto,
    queryRunner: QueryRunner,
  ): Promise<Person> {
    let address: Address | undefined;

    if (personDto.address) {
      const newAddress = queryRunner.manager.create(Address, personDto.address);
      address = await queryRunner.manager.save(Address, newAddress);
    }

    const person = queryRunner.manager.create(Person, {
      ...personDto,
      address: address,
      maritalStatus: personDto.maritalStatus ?? MaritalStatus.SINGLE,
    });

    return await queryRunner.manager.save(Person, person);
  }

  private async validateAndGetClassAndSection(
    classCode: ClassCode,
    sectionCode: SectionCode,
  ): Promise<{ classEntity: Class; section: Section }> {
    const classEntity = await this.classRepository.findOne({
      where: { code: classCode },
    });
    const section = await this.sectionRepository.findOne({
      where: { code: sectionCode },
    });

    if (!classEntity) {
      throw new UnprocessableEntityException(
        `Class with ID ${classCode} not found`,
      );
    }
    if (!section) {
      throw new UnprocessableEntityException(
        `Section with ID ${sectionCode} not found`,
      );
    }

    return { classEntity, section };
  }

  private async createStudentRelationships(
    parentDtos: CreateParentDto[],
    studentPerson: Person,
    studentId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    for (const parentDto of parentDtos) {
      await this.createSingleRelationship(
        parentDto.personId,
        parentDto.person,
        parentDto.relationType,
        studentPerson,
        studentId,
        queryRunner,
      );
    }
  }

  private async createGuardianRelationship(
    guardianId: number | undefined,
    guardianDto: CreatePersonDto | undefined,
    studentPerson: Person,
    studentId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await this.createSingleRelationship(
      guardianId,
      guardianDto,
      RelationType.GUARDIAN,
      studentPerson,
      studentId,
      queryRunner,
    );
  }

  private async createSingleRelationship(
    personId: number | undefined,
    personDto: CreatePersonDto | undefined,
    relationType: RelationType,
    targetPerson: Person,
    studentId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const relationPerson = await this.resolveOrCreatePerson(
      personId,
      personDto,
      queryRunner,
    );

    const relationship = queryRunner.manager.create(PersonRelationship, {
      sourcePerson: relationPerson,
      targetPerson: targetPerson,
      relationType: relationType,
      context: RelationContext.STUDENT,
      contextId: studentId,
    });

    await queryRunner.manager.save(PersonRelationship, relationship);
  }

  async findAll(query?: StudentQueryParams) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const offset = (page - 1) * limit;

    const where: Record<string, any> = {};

    if (query?.rollNumber !== undefined) {
      where.rollNumber = query.rollNumber;
    }
    if (query?.classCode) {
      where.class = { code: query.classCode };
    }
    if (query?.sectionCode) {
      where.section = { code: query.sectionCode };
    }
    if (query?.active !== undefined) {
      where.active = query.active;
    }

    // Person-related filters
    const personWhere: Record<string, any> = {};
    if (query?.firstName) {
      personWhere.firstName = Like(`%${query.firstName}%`);
    }
    if (query?.lastName) {
      personWhere.lastName = Like(`%${query.lastName}%`);
    }
    if (query?.phoneNumber) {
      personWhere.phoneNumber = Like(`%${query.phoneNumber}%`);
    }
    if (query?.email) {
      personWhere.email = Like(`%${query.email}%`);
    }

    if (Object.keys(personWhere).length > 0) {
      where.person = personWhere;
    }

    const totalItems = await this.studentRepository.count({
      where: Object.keys(where).length > 0 ? where : undefined,
    });

    const students = await this.studentRepository.find({
      where: Object.keys(where).length > 0 ? where : undefined,
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
          },
        });

        // Transform relationships to rename sourcePerson to person
        const transformedRelationships = relationships.map(
          ({ sourcePerson, ...rest }) => ({
            ...rest,
            person: sourcePerson,
          }),
        );

        return {
          ...student,
          relationships: transformedRelationships,
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

    // Transform relationships to rename sourcePerson to person
    const transformedRelationships = relationships.map(
      ({ sourcePerson, ...rest }) => ({
        ...rest,
        person: sourcePerson,
      }),
    );

    return {
      ...student,
      relationships: transformedRelationships,
    };
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const student = await this.studentRepository.findOne({
        where: { id },
        relations: {
          person: true,
          class: true,
          section: true,
        },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      if (updateStudentDto.classCode || updateStudentDto.sectionCode) {
        const { classEntity, section } =
          await this.validateAndGetClassAndSection(
            updateStudentDto.classCode ?? student.class.code,
            updateStudentDto.sectionCode ?? student.section.code,
          );
        student.class = classEntity;
        student.section = section;
      }

      if (updateStudentDto.rollNumber !== undefined) {
        student.rollNumber = updateStudentDto.rollNumber;
      }
      if (updateStudentDto.emergencyContact !== undefined) {
        student.emergencyContact = updateStudentDto.emergencyContact;
      }
      if (updateStudentDto.active !== undefined) {
        student.active = updateStudentDto.active;
      }

      const updatedStudent = await queryRunner.manager.save(Student, student);

      if (updateStudentDto.relations && updateStudentDto.relations.length > 0) {
        await this.deleteExistingRelationships(student.person.id, queryRunner);

        for (const relationDto of updateStudentDto.relations) {
          const relationPerson = await this.personRepository.findOne({
            where: { id: relationDto.personId },
          });

          if (!relationPerson) {
            throw new UnprocessableEntityException(
              `Person with ID ${relationDto.personId} not found`,
            );
          }

          const relationship = queryRunner.manager.create(PersonRelationship, {
            sourcePerson: relationPerson,
            targetPerson: student.person,
            relationType: relationDto.relationType,
            context: RelationContext.STUDENT,
            contextId: student.id,
          });

          await queryRunner.manager.save(PersonRelationship, relationship);
        }
      }

      await queryRunner.commitTransaction();
      return this.findOne(updatedStudent.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async deleteExistingRelationships(
    personId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.manager.delete(PersonRelationship, {
      targetPerson: { id: personId },
      context: RelationContext.STUDENT,
      relationType: RelationType.FATHER,
    });
    await queryRunner.manager.delete(PersonRelationship, {
      targetPerson: { id: personId },
      context: RelationContext.STUDENT,
      relationType: RelationType.MOTHER,
    });
    await queryRunner.manager.delete(PersonRelationship, {
      targetPerson: { id: personId },
      context: RelationContext.STUDENT,
      relationType: RelationType.GUARDIAN,
    });
  }

  async remove(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: {
        person: true,
        class: true,
        section: true,
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    student.active = State.INACTIVE;
    return await this.studentRepository.save(student);
  }
}

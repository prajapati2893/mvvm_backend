import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaritalStatus } from 'src/commons/types/types';
import {
  Address,
  Person,
  PersonRelationship,
  Student,
  Teacher,
} from 'src/database/entities';
import { Between, Like, Repository } from 'typeorm';
import { CreatePersonDto } from './dtos/create-person.dto';
import { PersonQueryParams } from './dtos/person-query-params.dto';
import { UpdatePersonDto } from './dtos/update-person.dto';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(PersonRelationship)
    private readonly personRelationshipRepository: Repository<PersonRelationship>,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    let address: Address | undefined;

    if (createPersonDto.address) {
      const newAddress = this.addressRepository.create(createPersonDto.address);
      address = await this.addressRepository.save(newAddress);
    }

    const person = this.personRepository.create({
      ...createPersonDto,
      dateOfBirth: new Date(createPersonDto.dateOfBirth),
      address: address,
      maritalStatus: createPersonDto.maritalStatus ?? MaritalStatus.SINGLE,
    });

    return await this.personRepository.save(person);
  }

  async findAll(params?: PersonQueryParams) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;

    const where: Record<string, any> = {};

    if (params?.firstName) {
      where.firstName = Like(`%${params.firstName}%`);
    }
    if (params?.lastName) {
      where.lastName = Like(`%${params.lastName}%`);
    }
    if (params?.phoneNumber) {
      where.phoneNumber = Like(`%${params.phoneNumber}%`);
    }
    if (params?.email) {
      where.email = Like(`%${params.email}%`);
    }
    if (params?.dateOfBirth) {
      const date = new Date(params.dateOfBirth);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      where.dateOfBirth = Between(startOfDay, endOfDay);
    }
    if (params?.gender) {
      where.gender = params.gender;
    }

    const totalItems = await this.personRepository.count({
      where: Object.keys(where).length > 0 ? where : undefined,
    });

    const persons = await this.personRepository.find({
      where: Object.keys(where).length > 0 ? where : undefined,
      relations: { address: true },
      skip: offset,
      take: limit,
    });

    return {
      data: persons,
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  async findOne(id: number) {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: { address: true },
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    return person;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: { address: true },
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    if (updatePersonDto.firstName !== undefined) {
      person.firstName = updatePersonDto.firstName;
    }
    if (updatePersonDto.lastName !== undefined) {
      person.lastName = updatePersonDto.lastName;
    }
    if (updatePersonDto.gender !== undefined) {
      person.gender = updatePersonDto.gender;
    }
    if (updatePersonDto.dateOfBirth !== undefined) {
      person.dateOfBirth = new Date(updatePersonDto.dateOfBirth);
    }
    if (updatePersonDto.bloodGroup !== undefined) {
      person.bloodGroup = updatePersonDto.bloodGroup;
    }
    if (updatePersonDto.phoneNumber !== undefined) {
      person.phoneNumber = updatePersonDto.phoneNumber;
    }
    if (updatePersonDto.email !== undefined) {
      person.email = updatePersonDto.email;
    }
    if (updatePersonDto.photo !== undefined) {
      person.photo = updatePersonDto.photo;
    }
    if (updatePersonDto.maritalStatus !== undefined) {
      person.maritalStatus = updatePersonDto.maritalStatus;
    }

    if (updatePersonDto.address) {
      if (person.address) {
        Object.assign(person.address, updatePersonDto.address);
        await this.addressRepository.save(person.address);
      } else {
        const newAddress = this.addressRepository.create(
          updatePersonDto.address,
        );
        person.address = await this.addressRepository.save(newAddress);
      }
    }

    return await this.personRepository.save(person);
  }

  async remove(id: number): Promise<void> {
    const person = await this.personRepository.findOne({
      where: { id },
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    const studentAssociation = await this.studentRepository.findOne({
      where: { person: { id } },
    });

    if (studentAssociation) {
      throw new BadRequestException(
        `Cannot delete person. Associated with student (ID: ${studentAssociation.id})`,
      );
    }

    const teacherAssociation = await this.teacherRepository.findOne({
      where: { person: { id } },
    });

    if (teacherAssociation) {
      throw new BadRequestException(
        `Cannot delete person. Associated with teacher (ID: ${teacherAssociation.id})`,
      );
    }

    const relationships = await this.personRelationshipRepository.find({
      where: [{ sourcePerson: { id } }, { targetPerson: { id } }],
    });

    if (relationships.length > 0) {
      throw new BadRequestException(
        `Cannot delete person. Has ${relationships.length} relationship(s). Please remove relationships first.`,
      );
    }

    await this.personRepository.remove(person);
  }
}

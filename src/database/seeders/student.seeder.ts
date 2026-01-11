import { InjectRepository } from '@nestjs/typeorm';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Student } from '../entities';
export class StudentSeeder implements Seeder {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async seed(): Promise<any> {
    const users = DataFactory.createForClass(Student).generate(10);
    await this.studentRepository.insert(users);
  }

  async drop(): Promise<any> {
    await this.studentRepository.deleteAll();
  }
}

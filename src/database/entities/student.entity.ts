import { Faker } from '@faker-js/faker';
import { Factory } from 'nestjs-seeder';
import { State } from 'src/commons/types/types';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { Person } from './person.entity';
import { Section } from './section.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Person)
  @JoinColumn()
  person: Person;

  @Factory(
    (faker: Faker) =>
      'ADM' +
      faker.string.alphanumeric({
        casing: 'upper',
        length: { min: 5, max: 5 },
      }),
  )
  @Column({ length: 10, unique: true, nullable: true })
  admissionNo: string;

  @ManyToOne(() => Class)
  class: Class;

  @ManyToOne(() => Section)
  section: Section;

  @Column({ unique: true })
  rollNumber: number;

  @Column({ nullable: true })
  house: string;

  @Column({ nullable: true, length: 10 })
  emergencyContact: string;

  @Column({ default: true })
  active: State;

  @CreateDateColumn({ name: 'created_at', comment: 'Date of admission' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

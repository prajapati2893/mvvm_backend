import { State } from 'src/commons/types/types';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { Person } from './person.entity';
import { Subject } from './subject.entity';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10, unique: true, nullable: true })
  teacherId: string;

  @OneToOne(() => Person)
  @JoinColumn()
  person: Person;

  @Column()
  state: State;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Class, (cls) => cls.teachers)
  classes: Class[];

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @JoinTable()
  subjects: Subject[];
}

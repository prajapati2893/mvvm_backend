import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Section } from './section.entity';
import { Student } from './student.entity';
import { Teacher } from './teacher.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Section, (section) => section.class)
  sections: Section[];

  @ManyToOne(() => Teacher)
  classTeacher: Teacher;

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];

  @ManyToMany(() => Teacher, (teacher) => teacher.classes)
  @JoinTable({
    joinColumn: {
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      referencedColumnName: 'id',
    },
  })
  teachers: Teacher[];
}

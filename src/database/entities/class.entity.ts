import type { ClassCode } from 'src/modules/classes/types';
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
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'pk_class' })
  id: number;

  @Column({ unique: true })
  code: ClassCode;

  @Column()
  displayName: string;

  @OneToMany(() => Section, (section) => section.class, { cascade: true })
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

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Teacher } from './teacher.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  description: string;

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects)
  teachers: Teacher[];
}

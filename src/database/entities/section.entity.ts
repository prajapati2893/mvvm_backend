import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Class } from './class.entity';

@Entity()
@Unique('uq_class_section', ['class', 'code'])
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1 })
  code: string;

  @ManyToOne(() => Class, (cls) => cls.sections)
  class: Class;
}

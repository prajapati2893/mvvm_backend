import type { SectionCode } from 'src/modules/classes/types';
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

  @Column()
  code: SectionCode;

  @ManyToOne(() => Class, (cls) => cls.sections)
  class: Class;
}

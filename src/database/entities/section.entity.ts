import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Class } from './class.entity';

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1 })
  name: string;

  @ManyToOne(() => Class, (cls) => cls.sections)
  class: Class;
}

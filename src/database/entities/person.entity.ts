import { Gender, MaritalStatus } from 'src/commons/types/types';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdditionDetail } from './addition-detail.entity';
import { Address } from './address.entity';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: false })
  gender: Gender;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ nullable: true, length: 4 })
  bloodGroup: string;

  @Column({ nullable: true, length: 10 })
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @ManyToOne(() => Address)
  address: Address;

  @Column({ nullable: true })
  photo: string;

  @Column({ type: 'enum', enum: MaritalStatus, default: MaritalStatus.SINGLE })
  maritalStatus: MaritalStatus;

  @OneToOne(() => AdditionDetail)
  additionDetail: AdditionDetail;
}

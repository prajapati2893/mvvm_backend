import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AdditionDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  aadhar: string;

  @Column({ nullable: true })
  qualification: string;

  @Column({ nullable: true })
  experienceYears: number;

  @Column({ nullable: true })
  occupation: string;
}

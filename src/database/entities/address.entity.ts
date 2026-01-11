import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  streetTown: string;

  @Column({ nullable: true })
  city: string;

  @Column()
  pin: number;

  @Column()
  state: string;

  @Column()
  country: string;
}

import { RelationContext, RelationType } from 'src/commons/types/types';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Person } from './person.entity';

@Entity()
export class PersonRelationship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Person)
  sourcePerson: Person;

  @ManyToOne(() => Person)
  targetPerson: Person;

  @Column({ type: 'enum', enum: RelationType })
  relationType: RelationType;

  @Column({ type: 'enum', enum: RelationContext })
  context: RelationContext;

  @Column()
  contextId: number;
}

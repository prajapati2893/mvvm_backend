import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { DatabaseModule } from '../database.module';
import { Student } from '../entities';
import { StudentSeeder } from './student.seeder';

seeder({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Student])],
}).run([StudentSeeder]);

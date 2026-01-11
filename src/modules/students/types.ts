import { Student } from 'src/database/entities';
import { FindManyOptions } from 'typeorm';

export type StudentQueryParams = FindManyOptions<Student> & {
  page: number;
  limit: number;
};

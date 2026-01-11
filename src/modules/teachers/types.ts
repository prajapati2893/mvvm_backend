import { Teacher } from 'src/database/entities';
import { FindManyOptions } from 'typeorm';

export type TeacherQueryParams = FindManyOptions<Teacher> & {
  page: number;
  limit: number;
};

import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { Student } from '../entities';

@EventSubscriber()
export class StudentSubscriber implements EntitySubscriberInterface<Student> {
  listenTo() {
    return Student;
  }

  async afterInsert(event: InsertEvent<Student>) {
    const newId = event.entity.id;
    event.entity.admissionNo = 'MVVS' + newId;
    try {
      await event.manager.save(event.entity);
    } catch (error) {
      console.log(error);
    }
  }
}

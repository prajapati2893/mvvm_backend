import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { Teacher } from '../entities';

@EventSubscriber()
export class TeacherSubscriber implements EntitySubscriberInterface<Teacher> {
  listenTo() {
    return Teacher;
  }

  async afterInsert(event: InsertEvent<Teacher>) {
    const newId = event.entity.id;
    event.entity.teacherId = 'MVVT' + newId;
    try {
      await event.manager.save(event.entity);
    } catch (error) {
      console.log(error);
    }
  }
}

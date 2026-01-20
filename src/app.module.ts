import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { DatabaseModule } from './database/database.module';
import { ClassesController } from './modules/classes/classes.controller';
import { ClassesModule } from './modules/classes/classes.module';
import { NotificationController } from './modules/notifications/notification.controller';
import { NotificationModule } from './modules/notifications/notification.module';
import { PersonsController } from './modules/persons/persons.controller';
import { PersonsModule } from './modules/persons/persons.module';
import { StudentsController } from './modules/students/students.controller';
import { StudentsModule } from './modules/students/students.module';
import { SubjectsController } from './modules/subjects/subjects.controller';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { TeachersController } from './modules/teachers/teachers.controller';
import { TeachersModule } from './modules/teachers/teachers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    ClassesModule,
    StudentsModule,
    SubjectsModule,
    TeachersModule,
    NotificationModule,
    PersonsModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        ClassesController,
        StudentsController,
        TeachersController,
        SubjectsController,
        NotificationController,
        PersonsController,
      );
  }
}

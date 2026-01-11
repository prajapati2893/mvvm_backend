import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BulkSmsAdapter } from './adapters';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [ConfigModule],
  controllers: [NotificationController],
  providers: [
    Logger,
    {
      provide: 'SMS_ADAPTER',
      useFactory: (configService: ConfigService, logger: Logger) => {
        return new BulkSmsAdapter(configService, logger);
      },
      inject: [ConfigService, Logger],
    },
    NotificationService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}

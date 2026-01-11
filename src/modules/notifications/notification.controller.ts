import { Body, Controller, Post } from '@nestjs/common';
import { SMSResponse } from './adapters';
import { SendSmsDto } from './dtos/send-sms.dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('sms')
  async sendSms(@Body() sendSmsDto: SendSmsDto): Promise<SMSResponse> {
    return this.notificationService.sendSms(sendSmsDto);
  }
}

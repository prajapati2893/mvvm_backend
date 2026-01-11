import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ISmsAdapter, SMSResponse } from './adapters';
import { SendSmsDto } from './dtos/send-sms.dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('SMS_ADAPTER')
    private readonly smsAdapter: ISmsAdapter,
    private readonly logger: Logger,
  ) {}

  async sendSms(sendSmsDto: SendSmsDto): Promise<SMSResponse> {
    const { recipients, message } = sendSmsDto;
    return await this.smsAdapter.sendSms(recipients.join(','), message);
  }
}

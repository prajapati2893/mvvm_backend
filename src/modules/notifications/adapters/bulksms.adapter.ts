import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ISmsAdapter, SMSResponse } from './messaging-adapter.interface';

@Injectable()
export class BulkSmsAdapter implements ISmsAdapter {
  private readonly apiKey: string | undefined;
  private readonly apiUrl: string | undefined;

  constructor(
    private configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.apiKey = this.configService.get<string>('BULKSMS_API_KEY');
    this.apiUrl = this.configService.get<string>('BULKSMS_APP_URL');
  }

  async sendSms(to: string, message: string): Promise<SMSResponse> {
    try {
      if (!this.apiUrl || !this.apiKey) {
        throw new Error('BulkSMS not configured');
      }
      this.logger.log(`requesting: ${this.apiUrl}`);
      const response = await axios.get(this.apiUrl, {
        params: {
          key: this.apiKey,
          campaign: this.configService.get<string>('BULKSMS_CAMPAIGN_ID'),
          routeid: this.configService.get<string>('BULKSMS_ROUTE_ID'),
          type: 'text',
          contacts: to,
          senderid: this.configService.get<string>('BULKSMS_SENDER_ID'),
          msg: message,
          template_id: this.configService.get<string>('BULKSMS_TEMPLATE_ID'),
          pe_id: this.configService.get<string>('BULKSMS_PE_ID'),
        },
      });

      const responseData = response.data as string;
      const responseObject: SMSResponse = {
        success: true,
        info: responseData,
      };
      if (responseData.startsWith('ERR')) {
        responseObject.success = false;
      }
      return responseObject;
      // TODO: Create a response interceptor to have uniform response body
    } catch (error) {
      this.logger.error(`Failed to send SMS : ${error}`);
      const errorObject = error as unknown as Error;
      throw new InternalServerErrorException(errorObject.name);
    }
  }
}

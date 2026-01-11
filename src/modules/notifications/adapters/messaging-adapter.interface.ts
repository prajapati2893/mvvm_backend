export interface SMSResponse {
  success: boolean;
  info?: string;
}

export interface ISmsAdapter {
  sendSms(to: string, message: string): Promise<SMSResponse>;
}

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './send-email.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(sendEmailDto: SendEmailDto) {
    await this.mailerService.sendMail({
      to: sendEmailDto.to,
      subject: sendEmailDto.subject,
      ...(sendEmailDto.template
        ? { template: sendEmailDto.template, context: sendEmailDto.context }
        : { html: sendEmailDto.html }),
    });
  }
}

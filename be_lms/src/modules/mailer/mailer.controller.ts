import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mailer.service';
import { SendEmailDto } from './send-email.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    await this.mailService.sendEmail(sendEmailDto);
    return { message: 'Email sent successfully' };
  }
}
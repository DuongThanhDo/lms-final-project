import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {} 

  @Get('create')
  async create(
    @Query('courseId') courseId: number,
    @Query('userId') userId: number,
    @Query('amount') amount: number,
    @Res() res: Response,
  ) {
    const result = await this.paymentService.createPayment(courseId, userId, amount);
    res.json(result);
  }

  @Get('return')
  async handleReturn(@Query() query: any, @Res() res: Response) {
    const result = await this.paymentService.handlePaymentReturn(query);
    const returnUrl = 'http://localhost:3000/payment-result';
    return res.redirect(`${returnUrl}?status=${result.status}&courseId=${result.courseId}`);
  }
}

import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {

  }

  @Post('create-payment-session')
  createPaymentSession(
    @Body() createPaymentDto: CreatePaymentDto
  ) {

    return this.paymentsService.createPaymentSession(createPaymentDto)

  }

  @Get('success')
  success() {

    return {
      ok: true,
      message: `Payment successful`
    }

  }

  @Get('cancelled')
  cancelled() {

    return {
      ok: false,
      message: `Payment cancelled`
    }

  }

  @Get('getById')
  getById(@Query('id') id: string) {

    return this.paymentsService.getById(id)

  }

  @Post('webhook')
  async dlocalWebhook(@Req() req: Request, @Res() res: Response) {

    return this.paymentsService.dlocalWebhook(req, res)

  }

}

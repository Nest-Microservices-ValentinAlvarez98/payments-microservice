import { Controller, Get, ParseUUIDPipe, Post, Query, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request, Response } from 'express';
import { envs } from 'src/config';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePaymentSessionDto } from './dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {

  }

  /* @Post('create-payment-session') */
  // La recomendación es que sean separadores con . para NATS, por las wildcards.
  @MessagePattern('payment.create.session')
  createPaymentSession(
    @Payload('createPaymentSession') createPaymentSessionDto: CreatePaymentSessionDto,
    @Payload('paymentId', ParseUUIDPipe) paymentId: string
  ) {

    return this.paymentsService.createPaymentSession(paymentId, createPaymentSessionDto)

  }



  @MessagePattern('payment.success')
  success(
    @Payload('message') message: string
  ) {

    return {
      ok: true,
      message: message
    }

  }

  @Get('cancelled')
  cancelled() {

    return {
      ok: false,
      message: `Payment cancelled`
    }

  }

  @Get('/dlocal/getById')
  getById(@Query('id') id: string) {

    return this.paymentsService.dlocalGetById(id)

  }

  @Post('webhook')
  async dlocalWebhook(@Req() req: Request, @Res() res: Response) {

    const isVerifiedSignature = this.varifySignature(req, res)

    console.log('isVerifiedSignature', isVerifiedSignature)

    if (!this.varifySignature(req, res)) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }

    return this.paymentsService.dlocalWebhook(req, res)

  }

  // Transformar en un middleware del endpoint de webhook
  private varifySignature(req: Request, res: Response): boolean {

    const signatureHeader = req.headers['authorization'];

    if (!signatureHeader) {
      return false;
    }

    const signature = signatureHeader.split('Signature: ')[1];

    const payload = JSON.stringify(req.body);

    const calculatedSignature = crypto.createHmac('sha256', envs.secretKey)
      .update(`${envs.apiKey}${payload}`)
      .digest('hex');

    if (signature !== calculatedSignature) {
      return false;
    }

    return true;

  }


}

import { HttpStatus, Inject, Injectable, Logger, } from '@nestjs/common';
import { PaymentResponse, PaymentSession, PaymentSessionResponse } from './interfaces';
import { NATS_SERVICE, envs } from 'src/config';
import { Request, Response } from 'express';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreatePaymentSessionDto } from './dto';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentsService {

      constructor(
            @Inject(NATS_SERVICE) private readonly client: ClientProxy
      ) {
      }

      private readonly logger = new Logger('PaymentsService')


      async createPaymentSession(paymentId: string, createPaymentSessionDto: CreatePaymentSessionDto) {

            const paymentSession: PaymentSession = {
                  ...createPaymentSessionDto,
                  success_url: `${envs.successUrl}/${createPaymentSessionDto.order_id}`,
                  back_url: envs.backUrl,
                  notification_url: envs.notificationUrl
            }

            const fetchResult = await fetch(`${envs.createPaymentSessionUrl}`, {
                  method: 'POST',
                  headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + envs.apiKey + ":" + envs.secretKey
                  },
                  body: JSON.stringify(paymentSession)
            })

            if (fetchResult.status !== 200 && fetchResult.status !== 201) {

                  throw new RpcException({
                        message: `Error creating payment session `,
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
                  })
            }

            const data: PaymentSessionResponse = await fetchResult.json()

            const paymentSessionCreated = await firstValueFrom(this.client.send('orders.payment.sessionCreated', {
                  payment_id: paymentId,
                  dlocal_payment_id: data.id
            }))


            return {
                  updatedPayment: paymentSessionCreated,
                  paymentSession: data
            }

      }


      async dlocalGetById(id: string) {

            const res = await fetch(`${envs.getPaymentUrl}/${id}`, {
                  method: 'GET',
                  headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + envs.apiKey + ":" + envs.secretKey
                  }
            })

            const data: PaymentResponse = await res.json()

            if (res.status !== 200) {
                  throw new RpcException({
                        message: `Error fetching payment`,
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
                  })
            }

            return data

      }

      async dlocalWebhook(req: Request, res: Response) {

            const body = req.body

            const fetchResult = await fetch(`${envs.getPaymentUrl}/${body.payment_id}`, {
                  method: 'GET',
                  headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + envs.apiKey + ":" + envs.secretKey
                  }
            })

            const data: PaymentResponse = await fetchResult.json()

            if (data.status === 'PAID') {

                  this.client.emit('orders.payment.succeeded', {
                        order_id: data.order_id,
                        orderStatus: data.status,
                        payment_id: data.id,
                        paymentStatus: data.status,
                  })

            } else {

                  this.client.emit('orders.payment.failed', {
                        order_id: data.order_id,
                        orderStatus: 'CANCELLED',
                        payment_id: data.id,
                        paymentStatus: data.status,
                  })

            }

            return res.status(200).json({
                  orderStatus: data.status,
                  order_id: data.order_id,
            })

      }

}

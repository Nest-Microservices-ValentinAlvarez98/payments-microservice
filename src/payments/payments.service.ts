import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto';
import { PaymentResponse, PaymentSession, PaymentSessionResponse } from './interfaces';
import { envs } from 'src/config';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {

      async createPaymentSession(createPaymentDto: CreatePaymentDto) {

            const paymentSession: PaymentSession = {
                  ...createPaymentDto,
                  success_url: envs.successUrl,
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

            const data: PaymentSessionResponse = await fetchResult.json()

            return data

      }

      async getById(id: string) {

            const res = await fetch(`${envs.getPaymentUrl}/${id}`, {
                  method: 'GET',
                  headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + envs.apiKey + ":" + envs.secretKey
                  }
            })

            const data: PaymentResponse = await res.json()

            console.log(data)

            switch (data.status) {
                  case 'PAID':
                        console.log('Conected to the order microservice to update the order status to PAID')
                        break;
                  case 'REJECTED':
                        console.log('Conected to the order microservice to update the order status to REJECTED')
                        break;
                  case 'CANCELLED':
                        console.log('Conected to the order microservice to update the order status to CANCELLED')
                        break;
                  case 'EXPIRED':
                        console.log('Conected to the order microservice to update the order status to EXPIRED')
                        break;
                  default:
                        return {
                              error: true,
                              message: 'Payment not found'
                        }
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

            let resultMessage = ""
            switch (data.status) {
                  case 'PAID':
                        resultMessage = 'Conected to the order microservice to update the order status to PAID'
                        break;
                  case 'REJECTED':
                        resultMessage = 'Conected to the order microservice to update the order status to REJECTED'
                        break;
                  case 'CANCELLED':
                        resultMessage = 'Conected to the order microservice to update the order status to CANCELLED'
                        break;
                  case 'EXPIRED':
                        resultMessage = 'Conected to the order microservice to update the order status to EXPIRED'
                        break;
                  default:
                        return {
                              error: true,
                              message: 'Payment not found'
                        }
            }

            return res.status(200).json({
                  message: resultMessage,
                  orderStatus: data.status,
                  order_id: data.order_id
            })

      }

}

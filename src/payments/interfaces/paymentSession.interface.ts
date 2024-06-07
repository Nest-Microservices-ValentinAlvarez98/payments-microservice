import { CreatePaymentDto } from "../dto";


export interface PaymentSession extends CreatePaymentDto {
      success_url: string;
      back_url: string;
      notification_url: string;
}
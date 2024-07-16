
import { CreatePaymentSessionDto } from "../dto";


export interface PaymentSession extends CreatePaymentSessionDto {
      success_url: string;
      back_url: string;
      notification_url: string;
}
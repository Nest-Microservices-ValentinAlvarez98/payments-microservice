import { PaymentStatus } from "./paymentResponse.interface"

export enum CurrencyEnum {
      UYU = "UYU",
      USD = "USD"
}

export interface PaymentSessionResponse {


      id: string,
      amount: number,
      currency: CurrencyEnum,
      country: string,
      description: string,
      created_date: string,
      status: PaymentStatus,
      order_id: string,
      notification_url: string,
      success_url: string,
      back_url: string,
      redirect_url: string,
      merchant_checkout_token: string,
      direct: boolean


}
export enum PaymentStatus {
      PENDING = 'PENDING',
      PAID = 'PAID',
      REJECTED = 'REJECTED',
      CANCELLED = 'CANCELLED',
      EXPIRED = 'EXPIRED'
}

export interface PaymentResponse {

      id: string;

      amount: number;

      currency: string;

      country: string;

      order_id: string;

      description: string;

      notification_url: string;

      success_url: string;

      back_url: string;

      redirect_url: string;

      payment_type: string;

      created_date: string;

      approved_date: string;

      status: PaymentStatus;

}
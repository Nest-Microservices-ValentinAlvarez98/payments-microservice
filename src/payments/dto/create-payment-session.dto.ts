import { IsEnum, IsNumber, IsString, IsUUID, ValidateNested } from "class-validator";
import { PaymentPayerDto } from ".";
import { PaymentCountry, PaymentCurrency, PaymentExpirationType } from "../enums";
import { Type } from "class-transformer";


export class CreatePaymentSessionDto {

      @ValidateNested()
      @Type(() => PaymentPayerDto)
      payer: PaymentPayerDto;

      @IsNumber()
      amount: number

      @IsEnum(PaymentCountry)
      country: PaymentCountry

      @IsEnum(PaymentCurrency)
      currency: PaymentCurrency

      @IsString()
      description: string

      @IsEnum(PaymentExpirationType)
      expiration_type: PaymentExpirationType

      @IsNumber()
      expiration_value: number

      @IsUUID()
      order_id: string

}
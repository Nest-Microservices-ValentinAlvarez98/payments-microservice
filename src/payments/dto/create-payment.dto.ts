import { IsString, IsNumber, IsEmail, IsOptional, Length, IsIn, IsUrl, Min, ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
      @IsString()
      @Length(3, 50)
      state: string;

      @IsString()
      @Length(3, 50)
      city: string;

      @IsString()
      @Length(3, 15)
      zip_code: string;

      @IsString()
      @Length(3, 50)
      full_address: string;
}

class PayerDto {
      @IsString()
      id: string;

      @IsString()
      @Length(3, 50)
      name: string;

      @IsEmail()
      email: string;

      @IsString()
      @Length(8, 15)
      phone: string;

      @IsOptional()
      @IsString()
      @IsIn(['DNI', 'CI', 'PASSPORT'])
      document_type?: string;

      @IsOptional()
      @IsString()
      @Length(7, 20)
      document?: string;

      @IsOptional()
      @IsString()
      @Length(3, 50)
      user_reference?: string;

      @IsOptional()
      @ValidateNested()
      @Type(() => AddressDto)
      address?: AddressDto;
}

export class CreatePaymentDto {
      @IsString()
      @Length(3, 3)
      @IsIn(['UYU', 'USD'])
      currency: string;

      @IsNumber()
      @Min(0)
      amount: number;

      @IsString()
      @IsIn(['UY'])
      country: string = 'UY';

      @IsString()
      @Length(3, 50)
      order_id: string;

      @IsOptional()
      @ValidateNested()
      @Type(() => PayerDto)
      payer?: PayerDto;

      @IsString()
      @Length(3, 50)
      description: string;

      @IsString()
      @IsIn(['MINUTES', 'HOURS', 'DAYS'])
      expiration_type: string;

      @IsNumber()
      @Min(0)
      expiration_value: number;
}

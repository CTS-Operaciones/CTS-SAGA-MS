
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ResourceDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  idResource: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
export class CreateHasAddRemoveDto {
  //Id del acta
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  idActa: number;

  @IsArray()
  @ValidateNested()
  @Type(() => ResourceDto)
  resource: ResourceDto[];
}

export class CreateRemoveDto {
  @IsNumber()
  idActa: number;

  @IsString()
  factura: number;

  @IsArray()
  idInventory: number[];
}

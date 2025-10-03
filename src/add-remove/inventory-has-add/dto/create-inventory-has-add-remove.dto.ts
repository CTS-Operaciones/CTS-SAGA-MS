
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateInventoryDto } from 'src/inventory/dto/create-inventory.dto';

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
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  idActa: number;

  @ValidateNested()
  @Type(() => CreateInventoryDto)
  inventory: CreateInventoryDto;
}

export class CreateRemoveDto {
  @IsNumber()
  idActa: number;

  @IsString()
  factura: number;

  @IsArray()
  idInventory: number[];
}

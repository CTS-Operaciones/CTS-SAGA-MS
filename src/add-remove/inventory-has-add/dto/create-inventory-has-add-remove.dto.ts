
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
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

  /* @IsNumber()
  user_id?: number; */
}

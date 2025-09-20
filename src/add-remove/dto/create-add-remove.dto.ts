import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { ADD_REMOVE } from '../../common/constants/enums';

export class Signature {
  @IsNumber()
  staff: number;

  @IsNumber()
  type_signature: number;
}

export class CreateAddRemoveDto {
  @IsString()
  @IsNotEmpty()
  motive: string;

  @IsString()
  @IsNotEmpty()
  observations: string;

  @IsEnum(ADD_REMOVE)
  @IsNotEmpty()
  type: ADD_REMOVE = ADD_REMOVE.ALTA;

  @IsString()
  factura: string;
}


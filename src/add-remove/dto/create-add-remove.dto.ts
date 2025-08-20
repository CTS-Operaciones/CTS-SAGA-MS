import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TYPE_REPORT } from '../../common/constants/sinature-enums';
import { ADD_REMOVE } from '../../common/constants/enums';
import { Type } from 'class-transformer';

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
  type: ADD_REMOVE;

  /* //Firmas del acta
  @IsEnum(TYPE_REPORT)
  typeDocument?: TYPE_REPORT.ADD;

  @IsArray()
  @ValidateNested()
  @Type(() => Signature)
  signature?: Signature[]; */
}

import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { TYPE_RESOURCE } from '../../common';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  quatity: number;

  @IsString()
  especifications: string;

  @IsNumber()
  clasificationId: number;

  @IsNumber()
  modelId: number;

  @IsEnum(TYPE_RESOURCE)
  @IsNotEmpty()
  type: TYPE_RESOURCE = TYPE_RESOURCE.INVENTARIO;
}

import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { ToBoolean } from 'src/common/decorator';
import { Timestamp } from 'typeorm';
export class CreateHabilitationDto {
  @IsDate()
  @IsNotEmpty()
  fecha: Date;
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  observations: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  project_id: number;

  @IsBoolean()
  @Type(() => Boolean)
  @ToBoolean('isRed')
  isRed: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  @ToBoolean('isLuz')
  isLuz: boolean;

  @Type(() => Boolean)
  @ToBoolean('isExtra')
  @IsBoolean()
  isExtra: boolean;

  @IsString()
  singCliente: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  admissionsDischarge: number;
}

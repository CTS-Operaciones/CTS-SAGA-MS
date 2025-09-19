import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { Timestamp } from 'typeorm';
export class CreateHabilitationDto {
  @IsDate()
  @IsNotEmpty()
  fecha: Timestamp;
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
  isRed: boolean;
  @IsBoolean()
  isLuz: boolean;
  @IsBoolean()
  isExtra: boolean;
  @IsString()
  singCliente: string;
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  admissionsDischarge: number;
}

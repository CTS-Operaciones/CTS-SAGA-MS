import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { MAITENANCE_TYPE, STATUS_MANTENANCE } from 'src/common/constants/enums';

export class CreateMantenanceDto {
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  description: string;

  @IsString()
  observation: string;

 @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  responsible: number;

  @IsEnum(STATUS_MANTENANCE)
  status: STATUS_MANTENANCE = STATUS_MANTENANCE.EN_OPERACION;

  @IsEnum(MAITENANCE_TYPE)
  maintenanceType: MAITENANCE_TYPE = MAITENANCE_TYPE.PREVENTIVO;
}

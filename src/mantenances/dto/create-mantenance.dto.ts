import {
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
  date_init: Date;

  @IsDate()
  @IsNotEmpty()
  date_end: Date;

  @IsString()
  description: string;

  @IsString()
  observations: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  responsible: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  projectId: number;

  @IsEnum(STATUS_MANTENANCE)
  status: STATUS_MANTENANCE = STATUS_MANTENANCE.EN_OPERACION;

  @IsEnum(MAITENANCE_TYPE)
  maintenanceType: MAITENANCE_TYPE = MAITENANCE_TYPE.PREVENTIVO;
}

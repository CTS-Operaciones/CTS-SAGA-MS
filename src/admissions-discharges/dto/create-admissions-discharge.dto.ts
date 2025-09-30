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
import { STATUS_ADMISSION } from 'src/common/constants/enums';
export class CreateAdmissionsDischargeDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
  @IsNotEmpty()
  @IsString()
  observations: string;

  @IsDate()
  date: Date;

  @IsPositive()
  @IsNotEmpty()
  @IsNumber()
  project_id: number;

  @IsPositive()
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsEnum(STATUS_ADMISSION)
  @IsNotEmpty()
  type: STATUS_ADMISSION = STATUS_ADMISSION.ADMISSION;

  @IsPositive()
  @IsNotEmpty()
  @IsNumber()
  assignment: number;
}

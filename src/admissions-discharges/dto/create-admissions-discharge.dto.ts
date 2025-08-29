import {
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

  @IsString()
  date: string;

  @IsPositive()
  @IsNotEmpty()
  @IsNumber()
  project_id: number;

  @IsPositive()
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsEnum(STATUS_ADMISSION)
  type: STATUS_ADMISSION;
}

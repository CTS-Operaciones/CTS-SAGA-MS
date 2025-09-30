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
import { ToBoolean } from 'cts-entities';
import { ASSIGNMENT_STATUS } from 'src/common/constants/enums';

export class CreateAssignmentDto {
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  comments: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  project_id: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  user_id: number;

  @IsEnum(ASSIGNMENT_STATUS)
  type: ASSIGNMENT_STATUS = ASSIGNMENT_STATUS.ASIGNACION;

  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  @ToBoolean('is_preassignment')
  is_preassignment: boolean = false;
}

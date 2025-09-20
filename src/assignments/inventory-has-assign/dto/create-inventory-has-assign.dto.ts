
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ASSIGNMENT_STATUS } from 'src/common';
import { ToBoolean } from 'src/common/decorator';

export class CreateHasAssignDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  idActa: number;

  @IsArray()
  idInventory: number[];

  @IsEnum(ASSIGNMENT_STATUS)
  @IsNotEmpty()
  type: ASSIGNMENT_STATUS = ASSIGNMENT_STATUS.ASIGNACION;

  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  @ToBoolean('is_preassignment')
  is_preassignment: boolean = false;
}
